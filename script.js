/**
 * script.js
 * Interactive logic for the Digital Rights & Censorship Showcase website.
 * Features: Sticky header scroll effect, reading progress, back-to-top control,
 * Custom Smooth Scrolling with Offsets, Scroll-Spy Active Menu tracking, Interactive Tabs,
 * and an Interactive Timeline with dynamic progress tracing.
 * 
 * Author: Antigravity AI
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const header = document.querySelector('header');
  const navMenu = document.querySelector('.nav-menu');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const readingProgress = document.getElementById('reading-progress');
  const backToTop = document.getElementById('back-to-top');
  
  // Tab Elements
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  // Timeline Elements
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineProgress = document.querySelector('.timeline-progress');
  const timelineContainer = document.querySelector('.timeline-container');

  // --- 1. Sticky Header Scroll Effect ---
  const handleHeaderScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (readingProgress) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
      readingProgress.style.width = `${Math.min(scrollPercent, 100)}%`;
    }

    if (backToTop) {
      const isVisible = window.scrollY > 400;
      backToTop.style.opacity = isVisible ? '1' : '0';
      backToTop.style.pointerEvents = isVisible ? 'auto' : 'none';
    }
  };
  window.addEventListener('scroll', handleHeaderScroll);
  handleHeaderScroll(); // Init status on load

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 2. Mobile Responsive Navigation Toggle ---
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.innerHTML = isOpen ? '✕' : '☰';
    });
  }

  // Close mobile menu when a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '☰';
      }
    });
  });

  // --- 3. Smooth Scrolling with Header Offset ---
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const headerHeight = header.offsetHeight;
        const targetOffset = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetOffset,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- 4. Scroll-Spy (Active Nav State Tracking) ---
  const scrollSpy = () => {
    const scrollPosition = window.scrollY + header.offsetHeight + 100; // Offset window scroll for buffer

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', scrollSpy);
  scrollSpy(); // Run initially

  // --- 5. Interactive Tabs Component (Bypassing Censorship) ---
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      
      // Deactivate all buttons & panes
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      
      // Activate clicked button & corresponding pane
      btn.classList.add('active');
      const activePane = document.getElementById(targetTab);
      if (activePane) {
        activePane.classList.add('active');
      }
    });

    // Keyboard navigation (Accessiblity: hit Enter or Space to switch tabs)
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // --- 6. Interactive Timeline Component (Sovereign Internet) ---
  const updateTimelineProgress = () => {
    // Find the active timeline item
    const activeItem = document.querySelector('.timeline-item.active');
    if (!activeItem || !timelineProgress || !timelineContainer) return;
    
    // Get positioning metrics relative to container
    const containerRect = timelineContainer.getBoundingClientRect();
    const activeDot = activeItem.querySelector('.timeline-dot');
    const dotRect = activeDot.getBoundingClientRect();
    
    // Calculate the percentage of track filled
    const progressHeight = (dotRect.top - containerRect.top) + (dotRect.height / 2);
    timelineProgress.style.height = `${progressHeight}px`;
  };

  timelineItems.forEach((item, index) => {
    // Click behavior to activate a timeline year
    item.addEventListener('click', () => {
      // Toggle active status: if already active, let's keep it active or close it. 
      // Traditional accordion: deactivate others, activate clicked one
      const wasActive = item.classList.contains('active');
      
      timelineItems.forEach(i => i.classList.remove('active'));
      
      if (!wasActive) {
        item.classList.add('active');
        item.setAttribute('aria-expanded', 'true');
      } else {
        // If clicking the active one, we can either keep it active or allow collapsing all.
        // Keeping at least one active maintains better visual layout; let's allow collapsing.
        item.classList.remove('active');
        item.setAttribute('aria-expanded', 'false');
      }
      
      // Recalculate progress line height
      setTimeout(updateTimelineProgress, 50); // slight delay to let DOM render accordion
    });

    // Keyboard compatibility
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
    
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  // Set the first timeline item as active on page load
  if (timelineItems.length > 0) {
    timelineItems[0].classList.add('active');
    setTimeout(updateTimelineProgress, 100);
  }

  // Recalculate timeline progress line on window resize
  window.addEventListener('resize', () => {
    updateTimelineProgress();
  });

  // --- 7. Interactive SVG World Map Zoom, Pan, and Tooltip Logic ---
  const mapCountries = document.querySelectorAll('.map-country');
  const mapTooltip = document.getElementById('map-tooltip');
  const mapContainer = document.querySelector('.interactive-map-container');
  const svg = document.querySelector('.freedom-map-svg');

  if (mapCountries.length > 0 && mapTooltip && mapContainer && svg) {
    // --- ViewBox State ---
    const baseViewBox = { x: 30.767, y: 241.591, w: 784.077, h: 458.627 };
    let viewBox = { ...baseViewBox };
    let zoomLevel = 1.0;
    const minZoom = 0.8;
    const maxZoom = 8.0;

    // --- Pan State ---
    let isPanning = false;
    let startPoint = { x: 0, y: 0 };

    // --- Update ViewBox ---
    function updateViewBox() {
      svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
    }

    // --- Constrain ViewBox (Pan/Zoom Limits) ---
    function constrainViewBox() {
      // Bound x and y so at least 15% of the map remains visible
      const maxX = baseViewBox.x + baseViewBox.w - viewBox.w * 0.15;
      const minX = baseViewBox.x - viewBox.w * 0.85;
      const maxY = baseViewBox.y + baseViewBox.h - viewBox.h * 0.15;
      const minY = baseViewBox.y - viewBox.h * 0.85;

      viewBox.x = Math.max(minX, Math.min(maxX, viewBox.x));
      viewBox.y = Math.max(minY, Math.min(maxY, viewBox.y));
    }

    // --- Zoom at Screen Coordinate ---
    function zoomAtPoint(factor, clientX, clientY) {
      let newZoomLevel = zoomLevel * factor;
      if (newZoomLevel < minZoom) newZoomLevel = minZoom;
      if (newZoomLevel > maxZoom) newZoomLevel = maxZoom;
      
      if (newZoomLevel === zoomLevel) return;

      const containerRect = mapContainer.getBoundingClientRect();
      
      // Mouse position relative to container
      const mouseXRel = clientX - containerRect.left;
      const mouseYRel = clientY - containerRect.top;

      // Convert mouse position to current SVG coordinates
      const svgMouseX = viewBox.x + (mouseXRel / containerRect.width) * viewBox.w;
      const svgMouseY = viewBox.y + (mouseYRel / containerRect.height) * viewBox.h;

      // New width and height
      const newW = baseViewBox.w / newZoomLevel;
      const newH = baseViewBox.h / newZoomLevel;

      // Adjust x and y so the SVG coordinates under the mouse remain under the mouse
      viewBox.x = svgMouseX - (mouseXRel / containerRect.width) * newW;
      viewBox.y = svgMouseY - (mouseYRel / containerRect.height) * newH;
      viewBox.w = newW;
      viewBox.h = newH;

      zoomLevel = newZoomLevel;
      constrainViewBox();
      updateViewBox();
    }

    // --- Zoom Buttons ---
    const btnZoomIn = document.getElementById('zoom-in');
    const btnZoomOut = document.getElementById('zoom-out');
    const btnZoomReset = document.getElementById('zoom-reset');

    if (btnZoomIn) {
      btnZoomIn.addEventListener('click', () => {
        const containerRect = mapContainer.getBoundingClientRect();
        const centerX = containerRect.left + containerRect.width / 2;
        const centerY = containerRect.top + containerRect.height / 2;
        zoomAtPoint(1.4, centerX, centerY);
      });
    }

    if (btnZoomOut) {
      btnZoomOut.addEventListener('click', () => {
        const containerRect = mapContainer.getBoundingClientRect();
        const centerX = containerRect.left + containerRect.width / 2;
        const centerY = containerRect.top + containerRect.height / 2;
        zoomAtPoint(1 / 1.4, centerX, centerY);
      });
    }

    if (btnZoomReset) {
      btnZoomReset.addEventListener('click', () => {
        viewBox = { ...baseViewBox };
        zoomLevel = 1.0;
        updateViewBox();
      });
    }

    // --- Panning Mouse Events ---
    svg.addEventListener('mousedown', (e) => {
      // Only pan on left click
      if (e.button !== 0) return;
      
      // Prevent text selection/drag interference
      e.preventDefault();
      
      isPanning = true;
      startPoint = { x: e.clientX, y: e.clientY };
      svg.classList.add('grabbing');
      mapTooltip.style.display = 'none';
      mapTooltip.setAttribute('aria-hidden', 'true');
    });

    svg.addEventListener('mousemove', (e) => {
      if (!isPanning) return;

      const containerRect = mapContainer.getBoundingClientRect();
      const scaleX = viewBox.w / containerRect.width;
      const scaleY = viewBox.h / containerRect.height;

      const dx = e.clientX - startPoint.x;
      const dy = e.clientY - startPoint.y;

      viewBox.x -= dx * scaleX;
      viewBox.y -= dy * scaleY;

      startPoint = { x: e.clientX, y: e.clientY };

      constrainViewBox();
      updateViewBox();
    });

    const endPan = () => {
      if (isPanning) {
        isPanning = false;
        svg.classList.remove('grabbing');
      }
    };

    window.addEventListener('mouseup', endPan);
    // In case user leaves window while dragging
    window.addEventListener('blur', endPan);

    // --- Wheel Zoom ---
    svg.addEventListener('wheel', (e) => {
      // Prevent default page scroll when zooming on map
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      zoomAtPoint(factor, e.clientX, e.clientY);
    }, { passive: false });

    // --- Double Click Zoom ---
    svg.addEventListener('dblclick', (e) => {
      e.preventDefault();
      zoomAtPoint(1.5, e.clientX, e.clientY);
    });

    // --- Tooltip Hover States ---
    mapCountries.forEach(country => {
      country.addEventListener('mouseenter', (e) => {
        if (isPanning) return;

        const name = country.getAttribute('data-country');
        const score = country.getAttribute('data-score');
        const status = country.getAttribute('data-status');
        
        let statusLabel = 'Unknown';
        let statusClass = '';
        if (status === 'free') {
          statusLabel = 'Free';
          statusClass = 'tooltip-status-free';
        } else if (status === 'partly-free') {
          statusLabel = 'Partly Free';
          statusClass = 'tooltip-status-partly-free';
        } else if (status === 'not-free') {
          statusLabel = 'Not Free';
          statusClass = 'tooltip-status-not-free';
        }

        mapTooltip.innerHTML = `
          <div class="map-tooltip-country">${name}</div>
          <div class="map-tooltip-score">Freedom Score: <span>${score}/100</span></div>
          <div class="map-tooltip-status ${statusClass}">${statusLabel}</div>
        `;
        
        mapTooltip.style.display = 'flex';
        mapTooltip.setAttribute('aria-hidden', 'false');
      });

      country.addEventListener('mousemove', (e) => {
        if (isPanning) {
          mapTooltip.style.display = 'none';
          mapTooltip.setAttribute('aria-hidden', 'true');
          return;
        }

        const containerRect = mapContainer.getBoundingClientRect();
        // Calculate position relative to the mapContainer
        const x = e.clientX - containerRect.left;
        const y = e.clientY - containerRect.top;
        
        mapTooltip.style.left = `${x}px`;
        mapTooltip.style.top = `${y}px`;
      });

      country.addEventListener('mouseleave', () => {
        mapTooltip.style.display = 'none';
        mapTooltip.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // --- 8. Interactive Glossary Tooltip System ---
  const abbrTags = document.querySelectorAll('abbr[title]');
  
  if (abbrTags.length > 0) {
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'glossary-tooltip';
    document.body.appendChild(tooltip);

    let activeTerm = null;

    // Helper to position the tooltip
    const positionTooltip = (target) => {
      const targetRect = target.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      // Position horizontally (centered relative to target)
      let left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2) + scrollX;
      
      // Position vertically (default above the term)
      let top = targetRect.top - tooltipRect.height - 10 + scrollY;
      let placement = 'top';

      // Constraint check: if it goes above the viewport, place it below the term instead
      if (targetRect.top - tooltipRect.height - 10 < 0) {
        top = targetRect.bottom + 10 + scrollY;
        placement = 'bottom';
      }

      // Constraint check: don't let it overflow left boundary
      if (left < 10) {
        left = 10;
      }
      // Constraint check: don't let it overflow right boundary
      const viewportWidth = document.documentElement.clientWidth;
      if (left + tooltipRect.width > viewportWidth - 10) {
        left = viewportWidth - tooltipRect.width - 10;
      }

      // Adjust arrow position in case of offsets
      const arrowOffset = (targetRect.left + targetRect.width / 2 + scrollX) - left;
      tooltip.style.setProperty('--arrow-left', `${arrowOffset}px`);

      // Set arrow direction class
      tooltip.classList.remove('tooltip-bottom', 'tooltip-top');
      if (placement === 'bottom') {
        tooltip.classList.add('tooltip-bottom');
      } else {
        tooltip.classList.add('tooltip-top');
      }

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    };

    const showTooltip = (target) => {
      const definition = target.getAttribute('data-definition') || target.getAttribute('title');
      if (!definition) return;

      // Store title in custom data attribute if not already done, then remove title to prevent browser default tooltip
      if (!target.getAttribute('data-definition')) {
        target.setAttribute('data-definition', definition);
      }
      target.removeAttribute('title');

      tooltip.textContent = definition;
      tooltip.classList.add('active');
      activeTerm = target;
      
      // Position tooltip after DOM rendering to get correct dimensions
      positionTooltip(target);
    };

    const hideTooltip = () => {
      tooltip.classList.remove('active');
      if (activeTerm) {
        // Restore title attribute
        const definition = activeTerm.getAttribute('data-definition');
        if (definition) {
          activeTerm.setAttribute('title', definition);
        }
        activeTerm = null;
      }
    };

    abbrTags.forEach(tag => {
      // Desktop: hover events
      tag.addEventListener('mouseenter', () => {
        showTooltip(tag);
      });

      tag.addEventListener('mouseleave', () => {
        hideTooltip();
      });

      // Mobile/Tablet: tap toggle events
      tag.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (activeTerm === tag) {
          hideTooltip();
        } else {
          showTooltip(tag);
        }
      });
      
      // Accessibility keyboard focus support
      tag.setAttribute('tabindex', '0');
      tag.addEventListener('focus', () => {
        showTooltip(tag);
      });
      tag.addEventListener('blur', () => {
        hideTooltip();
      });
    });

    // Hide tooltip on clicking outside or scrolling
    document.addEventListener('click', () => {
      hideTooltip();
    });

    window.addEventListener('scroll', () => {
      hideTooltip();
    });

    window.addEventListener('resize', () => {
      hideTooltip();
    });
  }
});
