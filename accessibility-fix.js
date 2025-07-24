(function () {
    'use strict';
    
    // Configuration
    const CONFIG = {
        retryAttempts: 4,
        retryDelays: [500, 1000, 2000, 3000],
        observerTimeout: 10000, // Stop observing after 10 seconds
        debug: false // Set to true for debugging
    };
    
    // Debug logging
    function log(message, data = null) {
        if (CONFIG.debug) {
            console.log(`[AccessibilityFix] ${message}`, data || '');
        }
    }
    
    // Main fix function
    function fixAllAccessibeIssues() {
        log('Running accessibility fixes...');
        let fixesApplied = 0;
        
        // Fix shadow DOM elements
        const accessibeWidgets = document.querySelectorAll('access-widget-ui');
        log(`Found ${accessibeWidgets.length} accessibe widgets`);
        
        accessibeWidgets.forEach((widget, index) => {
            try {
                if (widget.shadowRoot) {
                    // Remove skip links
                    const skipLinks = widget.shadowRoot.querySelectorAll('[data-acsb="skipLinks"], .skip-links[data-acsb="skipLinks"]');
                    skipLinks.forEach(el => {
                        log('Removing skip-links container from shadow DOM');
                        el.remove();
                        fixesApplied++;
                    });
                    
                    // Fix trigger button role
                    const triggerDiv = widget.shadowRoot.querySelector('.acsb-trigger.acsb-widget[role="button"]');
                    if (triggerDiv) {
                        log('Removing role="button" from trigger inside shadow root');
                        triggerDiv.removeAttribute('role');
                        fixesApplied++;
                    }
                }
            } catch (error) {
                log('Could not access shadow DOM for widget', error.message);
            }
        });
        
        // Fix light DOM elements
        const lightTriggerDiv = document.querySelector('.acsb-trigger.acsb-widget[role="button"]');
        if (lightTriggerDiv) {
            log('Removing role="button" from light DOM trigger');
            lightTriggerDiv.removeAttribute('role');
            fixesApplied++;
        }
        
        // Remove any problematic skip links in light DOM
        const lightSkipLinks = document.querySelectorAll('[data-acsb="skipLinks"], .skip-links[data-acsb="skipLinks"]');
        lightSkipLinks.forEach(el => {
            log('Removing skip-links container from light DOM');
            el.remove();
            fixesApplied++;
        });
        
        log(`Applied ${fixesApplied} accessibility fixes`);
        return fixesApplied > 0;
    }
    
    // Initialize the fix system
    function initializeAccessibilityFix() {
        log('Initializing accessibility fix system...');
        
        // Run immediately if DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fixAllAccessibeIssues);
        } else {
            fixAllAccessibeIssues();
        }
        
        // Run with delays to catch dynamically loaded content
        CONFIG.retryDelays.forEach(delay => {
            setTimeout(fixAllAccessibeIssues, delay);
        });
        
        // Set up mutation observer for dynamic content
        const observer = new MutationObserver((mutations) => {
            let shouldRunFix = false;
            
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if any added nodes are accessibility widgets
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === 'ACCESS-WIDGET-UI' || 
                                node.querySelector && node.querySelector('access-widget-ui')) {
                                shouldRunFix = true;
                                break;
                            }
                        }
                    }
                    if (shouldRunFix) break;
                }
            }
            
            if (shouldRunFix) {
                log('Detected new accessibility widgets, running fixes...');
                setTimeout(fixAllAccessibeIssues, 100);
            }
        });
        
        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Stop observing after timeout to prevent memory leaks
        setTimeout(() => {
            observer.disconnect();
            log('Mutation observer disconnected after timeout');
        }, CONFIG.observerTimeout);
        
        // Run fix when window fully loads
        window.addEventListener('load', () => {
            setTimeout(fixAllAccessibeIssues, 500);
        });
        
        log('Accessibility fix system initialized successfully');
    }
    
    // Start the system
    initializeAccessibilityFix();
    
    // Expose global function for manual triggering
    window.fixAccessibilityIssues = fixAllAccessibeIssues;
    
})();
