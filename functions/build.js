const { Octokit } = require('@octokit/rest');
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

/**
 * Netlify/Lambda Function: Build Trigger Service
 * 
 * Accepts validated markdown, creates a GitHub branch, commits content,
 * and triggers a GitHub Actions workflow to build the site.
 * 
 * POST /api/build
 * Body: { markdown: string, projectId: string, metadata: object }
 */
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { markdown, projectId, metadata } = JSON.parse(event.body);

    if (!markdown || !projectId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required fields: markdown, projectId' 
        })
      };
    }

    const buildId = uuidv4();
    const branchName = `build/${buildId}`;
    const timestamp = new Date().toISOString();
    const slug = metadata?.slug || 'index';
    const title = metadata?.title || 'Untitled';

    console.log(`[Build ${buildId}] Starting build for project ${projectId}`);

    // Store build metadata in DynamoDB (if configured)
    if (process.env.AWS_DYNAMODB_TABLE) {
      try {
        await dynamodb.put({
          TableName: process.env.AWS_DYNAMODB_TABLE,
          Item: {
            buildId,
            projectId,
            status: 'queued',
            createdAt: timestamp,
            authorEmail: metadata?.author || 'unknown',
            title,
            slug,
            fileSize: markdown.length,
            ttl: Math.floor(Date.now() / 1000) + (7 * 365 * 24 * 60 * 60) // 7 years
          }
        }).promise();
        console.log(`[Build ${buildId}] Metadata stored in DynamoDB`);
      } catch (err) {
        console.warn(`[Build ${buildId}] DynamoDB storage failed:`, err.message);
        // Continue anyway - DynamoDB is optional
      }
    }

    // GitHub integration
    const owner = process.env.GITHUB_ORG || process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;

    if (!owner || !repo) {
      throw new Error('GitHub configuration missing: GITHUB_ORG and GITHUB_REPO required');
    }

    // Get main branch SHA
    const mainRef = await octokit.git.getRef({
      owner,
      repo,
      ref: 'heads/main'
    });

    console.log(`[Build ${buildId}] Got main branch SHA: ${mainRef.data.object.sha.substring(0, 7)}`);

    // Create feature branch
    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: mainRef.data.object.sha
    });

    console.log(`[Build ${buildId}] Created branch: ${branchName}`);

    // Create/update markdown file in content directory
    const filePath = `content/${projectId}/${slug}.md`;
    
    // Check if file exists
    let existingFile;
    try {
      existingFile = await octokit.repos.getContent({
        owner,
        repo,
        path: filePath,
        ref: branchName
      });
    } catch (err) {
      // File doesn't exist, that's fine
      existingFile = null;
    }

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: `build: ${title} [${buildId}]`,
      content: Buffer.from(markdown).toString('base64'),
      branch: branchName,
      sha: existingFile?.data?.sha, // Required for updates
      author: {
        name: metadata?.authorName || 'Twelvety Service',
        email: metadata?.author || 'service@twelvety.dev'
      }
    });

    console.log(`[Build ${buildId}] Committed file: ${filePath}`);

    // Trigger GitHub Actions workflow
    try {
      await octokit.actions.createWorkflowDispatch({
        owner,
        repo,
        workflow_id: 'build.yml',
        ref: branchName,
        inputs: {
          buildId,
          projectId
        }
      });
      console.log(`[Build ${buildId}] Triggered workflow dispatch`);
    } catch (err) {
      console.error(`[Build ${buildId}] Workflow dispatch failed:`, err.message);
      // This might fail if workflow doesn't exist yet, but the push should trigger it anyway
    }

    const serviceUrl = process.env.SERVICE_URL || `https://${event.headers.host}`;
    
    return {
      statusCode: 202,
      headers,
      body: JSON.stringify({
        status: 'queued',
        buildId,
        projectId,
        branchName,
        filePath,
        estimatedTime: 5,
        pollingUrl: `${serviceUrl}/api/build/${buildId}/status`,
        metadata: {
          title,
          slug,
          createdAt: timestamp
        }
      })
    };
  } catch (error) {
    console.error('Build trigger error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Build trigger failed',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};
