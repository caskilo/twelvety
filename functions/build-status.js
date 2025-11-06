const AWS = require('aws-sdk');
const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({ 
  auth: process.env.GITHUB_TOKEN 
});

const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

/**
 * Netlify/Lambda Function: Build Status Query Service
 * 
 * Queries build status from DynamoDB and GitHub Actions workflows.
 * 
 * GET /api/build/{buildId}/status
 */
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Extract buildId from path
    const buildId = event.path.split('/').filter(p => p).pop();
    
    if (!buildId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Build ID required' })
      };
    }

    // Get build metadata from DynamoDB (if available)
    let buildData = null;
    if (process.env.AWS_DYNAMODB_TABLE) {
      try {
        const result = await dynamodb.get({
          TableName: process.env.AWS_DYNAMODB_TABLE,
          Key: { buildId }
        }).promise();
        buildData = result.Item;
      } catch (err) {
        console.warn(`DynamoDB query failed for ${buildId}:`, err.message);
      }
    }

    if (!buildData) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Build not found' })
      };
    }

    // Query GitHub Actions for workflow status
    const owner = process.env.GITHUB_ORG || process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;

    let workflowStatus = 'unknown';
    let workflowConclusion = null;
    let workflowUrl = null;

    if (owner && repo) {
      try {
        // List recent workflow runs
        const workflows = await octokit.actions.listWorkflowRunsForRepo({
          owner,
          repo,
          per_page: 50
        });

        // Find the workflow for this build
        const branchName = `build/${buildId}`;
        const workflow = workflows.data.workflow_runs.find(w => 
          w.head_branch === branchName
        );

        if (workflow) {
          workflowStatus = workflow.status;
          workflowConclusion = workflow.conclusion;
          workflowUrl = workflow.html_url;
        }
      } catch (err) {
        console.warn(`GitHub workflow query failed for ${buildId}:`, err.message);
      }
    }

    // Determine final status
    let finalStatus = buildData.status || 'queued';
    if (workflowStatus === 'completed') {
      finalStatus = workflowConclusion === 'success' ? 'completed' : 'failed';
    } else if (workflowStatus === 'in_progress') {
      finalStatus = 'building';
    }

    // Build URLs
    const siteUrl = process.env.SITE_URL 
      ? `${process.env.SITE_URL}/${buildData.projectId}/`
      : null;
    
    const downloadUrl = process.env.SERVICE_URL
      ? `${process.env.SERVICE_URL}/download/${buildId}`
      : null;

    const archiveUrl = process.env.AWS_BUCKET_NAME
      ? `s3://${process.env.AWS_BUCKET_NAME}/archives/${buildData.projectId}/${buildId}/`
      : null;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        buildId,
        projectId: buildData.projectId,
        status: finalStatus,
        title: buildData.title,
        slug: buildData.slug,
        createdAt: buildData.createdAt,
        authorEmail: buildData.authorEmail,
        fileSize: buildData.fileSize,
        workflow: {
          status: workflowStatus,
          conclusion: workflowConclusion,
          url: workflowUrl
        },
        urls: {
          site: siteUrl,
          download: downloadUrl,
          archive: archiveUrl
        }
      })
    };
  } catch (error) {
    console.error('Status check error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Status check failed',
        message: error.message
      })
    };
  }
};
