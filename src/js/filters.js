// Filter panel functionality
(function() {
  const NAV_STATE_KEY = 'site-nav-collapsed';
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFilters);
  } else {
    initFilters();
  }
  
  function initFilters() {
    const filterToggle = document.getElementById('filter-toggle');
    const filterPanel = document.getElementById('filter-panel');
    const filterClose = document.getElementById('filter-close');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const navToggle = document.getElementById('nav-toggle');
    const siteNav = document.getElementById('site-nav');
    const navPanel = document.getElementById('site-nav-panel');
    const navToggleLabel = navToggle?.querySelector('.nav-toggle-label');
    const siteHeader = document.querySelector('.site-header');
    const NAV_LABEL_COLLAPSED = 'Show Menu';
    const NAV_LABEL_EXPANDED = 'Hide Menu';
    
    if (filterToggle && filterPanel) {
      // Toggle filter panel
      filterToggle.addEventListener('click', () => {
        filterPanel.hidden = !filterPanel.hidden;
      });
    }
    
    if (filterClose && filterPanel) {
      filterClose.addEventListener('click', () => {
        filterPanel.hidden = true;
      });
    }
    
    if (applyFiltersBtn) {
      applyFiltersBtn.addEventListener('click', applyFilters);
    }
    
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', clearFilters);
    }

    if (siteHeader) {
      const setHeaderHeight = () => {
        const headerHeight = siteHeader.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
      };
      setHeaderHeight();
      window.addEventListener('resize', setHeaderHeight);
    }

    if (navToggle && siteNav && navPanel) {
      const storedState = localStorage.getItem(NAV_STATE_KEY);
      const initialCollapsed = storedState === 'true';
      const setNavCollapsed = (collapsed) => {
        if (collapsed) {
          siteNav.classList.add('collapsed');
        } else {
          siteNav.classList.remove('collapsed');
        }
        navToggle.setAttribute('aria-expanded', String(!collapsed));
        navToggle.setAttribute('aria-label', collapsed ? 'Expand navigation' : 'Collapse navigation');
        navToggle.classList.toggle('is-expanded', !collapsed);
        if (navToggleLabel) {
          navToggleLabel.textContent = collapsed ? NAV_LABEL_COLLAPSED : NAV_LABEL_EXPANDED;
        }
        localStorage.setItem(NAV_STATE_KEY, String(collapsed));
      };

      setNavCollapsed(initialCollapsed);

      navToggle.addEventListener('click', () => {
        const currentlyCollapsed = siteNav.classList.contains('collapsed');
        setNavCollapsed(!currentlyCollapsed);
      });

      const navLinks = siteNav.querySelectorAll('.nav-link, .quick-links a');
      navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
          if (event.button === 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
          }
          setNavCollapsed(true);
        });
      });
    }
    
    setupSectionLinkContext();
    restoreSectionScroll();
    setupBackLink();
    setupPolicyModal();
    
    // Load saved filters from localStorage
    loadSavedFilters();
  }

  function setupPolicyModal() {
    const policyLink = document.getElementById('policy-viewer-link');
    const policyModal = document.getElementById('policy-modal');
    const modalClose = document.getElementById('policy-modal-close');
    const modalBackdrop = policyModal?.querySelector('.modal-backdrop');
    
    if (!policyLink || !policyModal) return;
    
    policyLink.addEventListener('click', (e) => {
      e.preventDefault();
      policyModal.hidden = false;
      document.body.style.overflow = 'hidden';
    });
    
    const closeModal = () => {
      policyModal.hidden = true;
      document.body.style.overflow = '';
    };
    
    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }
    
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', closeModal);
    }
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !policyModal.hidden) {
        closeModal();
      }
    });
  }

  function setupSectionLinkContext() {
    const sectionLinks = document.querySelectorAll('.section-entry-link');
    if (sectionLinks.length === 0) return;
    
    sectionLinks.forEach(link => {
      link.addEventListener('click', () => {
        const context = {
          sectionId: link.dataset.section,
          sectionTitle: link.dataset.sectionTitle,
          sectionUrl: window.location.pathname,
          scrollPosition: window.scrollY
        };
        sessionStorage.setItem('section-context', JSON.stringify(context));
      });
    });
  }

  function restoreSectionScroll() {
    const sectionPage = document.querySelector('.section-page');
    if (!sectionPage) return;
    const raw = sessionStorage.getItem('section-context');
    if (!raw) return;
    
    try {
      const context = JSON.parse(raw);
      if (context.sectionUrl === window.location.pathname) {
        window.scrollTo({ top: context.scrollPosition || 0 });
        sessionStorage.removeItem('section-context');
      }
    } catch (error) {
      console.error('Failed to restore section scroll position:', error);
    }
  }

  function setupBackLink() {
    const backLinkWrapper = document.getElementById('section-back-link');
    const backButton = document.getElementById('section-back-button');
    if (!backLinkWrapper || !backButton) return;
    const raw = sessionStorage.getItem('section-context');
    if (!raw) return;
    
    try {
      const context = JSON.parse(raw);
      if (!context.sectionUrl) return;
      backLinkWrapper.hidden = false;
      backButton.textContent = `← Back to ${context.sectionTitle || 'section'}`;
      backButton.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = context.sectionUrl;
      });
    } catch (error) {
      console.error('Failed to set up section back link:', error);
    }
  }
  
  function applyFilters() {
    const filters = getSelectedFilters();
    
    // Save filters to localStorage
    localStorage.setItem('repository-filters', JSON.stringify(filters));
    
    // Build query string
    const params = new URLSearchParams();
    
    if (filters.audience.length > 0) {
      params.set('audience', filters.audience.join(','));
    }
    
    if (filters.evidenceLevel.length > 0) {
      params.set('evidence', filters.evidenceLevel.join(','));
    }
    
    if (filters.ageRange.length > 0) {
      params.set('age', filters.ageRange.join(','));
    }
    
    // Reload page with filters
    const queryString = params.toString();
    window.location.href = window.location.pathname + (queryString ? '?' + queryString : '');
  }
  
  function clearFilters() {
    // Uncheck all checkboxes
    document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = false;
    });
    
    // Clear localStorage
    localStorage.removeItem('repository-filters');
    
    // Remove query parameters
    window.location.href = window.location.pathname;
  }
  
  function getSelectedFilters() {
    const filters = {
      audience: [],
      evidenceLevel: [],
      ageRange: []
    };
    
    document.querySelectorAll('.filter-option input[name="audience"]:checked').forEach(checkbox => {
      filters.audience.push(checkbox.value);
    });
    
    document.querySelectorAll('.filter-option input[name="evidenceLevel"]:checked').forEach(checkbox => {
      filters.evidenceLevel.push(checkbox.value);
    });
    
    document.querySelectorAll('.filter-option input[name="ageRange"]:checked').forEach(checkbox => {
      filters.ageRange.push(checkbox.value);
    });
    
    return filters;
  }
  
  function loadSavedFilters() {
    const saved = localStorage.getItem('repository-filters');
    if (!saved) return;
    
    try {
      const filters = JSON.parse(saved);
      
      // Restore checkbox states
      filters.audience?.forEach(value => {
        const checkbox = document.querySelector(`.filter-option input[name="audience"][value="${value}"]`);
        if (checkbox) checkbox.checked = true;
      });
      
      filters.evidenceLevel?.forEach(value => {
        const checkbox = document.querySelector(`.filter-option input[name="evidenceLevel"][value="${value}"]`);
        if (checkbox) checkbox.checked = true;
      });
      
      filters.ageRange?.forEach(value => {
        const checkbox = document.querySelector(`.filter-option input[name="ageRange"][value="${value}"]`);
        if (checkbox) checkbox.checked = true;
      });
    } catch (error) {
      console.error('Failed to load saved filters:', error);
    }
  }
  
  // Apply client-side filtering on list pages
  function filterContentItems() {
    const params = new URLSearchParams(window.location.search);
    
    const audienceFilter = params.get('audience')?.split(',') || [];
    const evidenceFilter = params.get('evidence')?.split(',') || [];
    const ageFilter = params.get('age')?.split(',') || [];
    
    if (audienceFilter.length === 0 && evidenceFilter.length === 0 && ageFilter.length === 0) {
      return; // No filters active
    }
    
    // Filter content items (this assumes items have data attributes)
    document.querySelectorAll('[data-content-item]').forEach(item => {
      const itemAudience = (item.dataset.audience || '').split(',');
      const itemEvidence = item.dataset.evidence;
      const itemAge = (item.dataset.age || '').split(',');
      
      let show = true;
      
      if (audienceFilter.length > 0) {
        show = show && audienceFilter.some(a => itemAudience.includes(a));
      }
      
      if (evidenceFilter.length > 0) {
        show = show && evidenceFilter.includes(itemEvidence);
      }
      
      if (ageFilter.length > 0) {
        show = show && ageFilter.some(a => itemAge.includes(a));
      }
      
      item.style.display = show ? '' : 'none';
    });
    
    // Show filter summary
    showFilterSummary(audienceFilter, evidenceFilter, ageFilter);
  }
  
  function showFilterSummary(audience, evidence, age) {
    const summary = [];
    
    if (audience.length > 0) {
      summary.push(`Audience: ${audience.join(', ')}`);
    }
    
    if (evidence.length > 0) {
      summary.push(`Evidence: ${evidence.join(', ')}`);
    }
    
    if (age.length > 0) {
      summary.push(`Age: ${age.join(', ')}`);
    }
    
    if (summary.length > 0) {
      const banner = document.createElement('div');
      banner.className = 'filter-active-banner';
      banner.innerHTML = `
        <strong>Active Filters:</strong> ${summary.join(' | ')}
        <button onclick="window.location.href=window.location.pathname">Clear Filters</button>
      `;
      
      document.querySelector('.main-content')?.prepend(banner);
    }
  }
  
  // Run filtering on page load
  if (window.location.search) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', filterContentItems);
    } else {
      filterContentItems();
    }
  }
})();
