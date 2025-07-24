(function() {
    'use strict';
    
    let isProcessing = false;
    
    function processAccessibeWidgets() {
        document.querySelectorAll('access-widget-ui').forEach(widget => {
            if (!widget.shadowRoot) return;
            
            try {
                // Remove skip links
                widget.shadowRoot.querySelectorAll('[data-acsb="skipLinks"]')
                    .forEach(el => el.remove());
                
                // Remove role attribute from trigger
                const trigger = widget.shadowRoot.querySelector('.acsb-trigger.acsb-widget[role="button"]');
                if (trigger) trigger.removeAttribute('role');
            } catch (error) {
                console.warn('Shadow DOM access failed:', error);
            }
        });
    }
    
    function processLightDomTrigger() {
        const trigger = document.querySelector('.acsb-trigger.acsb-widget[role="button"]');
        if (trigger) trigger.removeAttribute('role');
    }
    
    function addLegendsToFieldsets() {
        document.querySelectorAll('fieldset.needsclick:not([data-legend-inserted])').forEach(fieldset => {
            const legend = document.createElement('legend');
            legend.className = 'visuallyhidden';
            legend.textContent = 'Consent Checkbox';
            fieldset.prepend(legend);
            fieldset.setAttribute('data-legend-inserted', 'true');
        });
    }
    
    function fixAccessibilityIssues() {
        if (isProcessing) return;
        isProcessing = true;
        
        processAccessibeWidgets();
        processLightDomTrigger();
        addLegendsToFieldsets();
        
        isProcessing = false;
    }
    
    // Initial fixes
    document.addEventListener('DOMContentLoaded', fixAccessibilityIssues);
    window.addEventListener('load', () => setTimeout(fixAccessibilityIssues, 500));
    
    // Delayed fixes for dynamic content
    [500, 1000, 2000, 3000].forEach(delay => 
        setTimeout(fixAccessibilityIssues, delay)
    );
    
    // Observe DOM changes
    new MutationObserver(mutations => {
        if (mutations.some(m => m.addedNodes.length > 0)) {
            setTimeout(fixAccessibilityIssues, 100);
        }
    }).observe(document.body, { childList: true, subtree: true });
})();
