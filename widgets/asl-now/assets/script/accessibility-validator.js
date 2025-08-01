/**
 * ASL Now Widget - WCAG 2.2 Level AA Accessibility Validator
 * This script helps ensure the widget meets accessibility standards
 */

(function() {
    'use strict';

    class AccessibilityValidator {
        constructor() {
            this.issues = [];
            this.warnings = [];
            this.widget = document.getElementById('ASLNow');
        }

        // Initialize validation
        init() {
            if (!this.widget) {
                console.warn('ASL Now widget not found');
                return;
            }

            this.validateStructure();
            this.validateColors();
            this.validateKeyboardNavigation();
            this.validateFocus();
            this.validateLabels();
            this.validateVideo();
            this.validateForm();
            this.reportResults();
        }

        // Validate semantic structure
        validateStructure() {
            // Check for proper ARIA attributes
            const ariaLabel = this.widget.getAttribute('aria-label');
            if (!ariaLabel) {
                this.issues.push('Widget missing aria-label attribute');
            }

            // Check for proper role
            const role = this.widget.getAttribute('role');
            if (role !== 'dialog') {
                this.issues.push('Widget should have role="dialog"');
            }

            // Check for proper heading structure
            const headings = this.widget.querySelectorAll('h1, h2, h3, h4, h5, h6');
            let previousLevel = 0;
            headings.forEach(heading => {
                const level = parseInt(heading.tagName.charAt(1));
                if (level > previousLevel + 1) {
                    this.warnings.push(`Heading level skipped: ${heading.tagName} after h${previousLevel}`);
                }
                previousLevel = level;
            });

            // Check for proper list structure
            const lists = this.widget.querySelectorAll('ul[role="list"]');
            if (lists.length === 0) {
                this.warnings.push('Consider adding role="list" to ul elements');
            }
        }

        // Validate color contrast
        validateColors() {
            // This is a simplified check - in production, you'd want more sophisticated color analysis
            const elements = this.widget.querySelectorAll('*');
            elements.forEach(element => {
                const computedStyle = window.getComputedStyle(element);
                const color = computedStyle.color;
                const backgroundColor = computedStyle.backgroundColor;
                
                // Check if text is visible (basic check)
                if (color === backgroundColor && color !== 'rgba(0, 0, 0, 0)') {
                    this.issues.push(`Potential color contrast issue on ${element.tagName}`);
                }
            });
        }

        // Validate keyboard navigation
        validateKeyboardNavigation() {
            const interactiveElements = this.widget.querySelectorAll(
                'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
            );

            interactiveElements.forEach(element => {
                // Check for tab index
                const tabIndex = element.getAttribute('tabindex');
                if (tabIndex && parseInt(tabIndex) > 0) {
                    this.warnings.push(`Avoid positive tabindex values: ${element.tagName}`);
                }

                // Check for keyboard event handlers
                if (element.onclick && !element.onkeydown) {
                    this.warnings.push(`Element with onclick should also handle keyboard events: ${element.tagName}`);
                }
            });
        }

        // Validate focus management
        validateFocus() {
            const focusableElements = this.widget.querySelectorAll(
                'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
            );

            focusableElements.forEach(element => {
                // Check for visible focus indicators
                const computedStyle = window.getComputedStyle(element, ':focus');
                const outline = computedStyle.outline;
                const outlineWidth = computedStyle.outlineWidth;
                
                if (outline === 'none' || outlineWidth === '0px') {
                    // Check if there's a custom focus style
                    const boxShadow = computedStyle.boxShadow;
                    if (!boxShadow || boxShadow === 'none') {
                        this.warnings.push(`Element may lack visible focus indicator: ${element.tagName}`);
                    }
                }
            });
        }

        // Validate labels and descriptions
        validateLabels() {
            // Check form labels
            const inputs = this.widget.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                const id = input.getAttribute('id');
                const ariaLabel = input.getAttribute('aria-label');
                const ariaLabelledBy = input.getAttribute('aria-labelledby');
                const label = id ? document.querySelector(`label[for="${id}"]`) : null;

                if (!label && !ariaLabel && !ariaLabelledBy) {
                    this.issues.push(`Form control missing label: ${input.tagName}`);
                }
            });

            // Check images
            const images = this.widget.querySelectorAll('img');
            images.forEach(img => {
                const alt = img.getAttribute('alt');
                const ariaLabel = img.getAttribute('aria-label');
                const role = img.getAttribute('role');

                if (alt === null && !ariaLabel && role !== 'presentation') {
                    this.issues.push('Image missing alt attribute');
                } else if (alt === '' && !ariaLabel && role !== 'presentation') {
                    // Empty alt is okay for decorative images
                    this.warnings.push('Image has empty alt - ensure it is decorative');
                }
            });

            // Check buttons
            const buttons = this.widget.querySelectorAll('button');
            buttons.forEach(button => {
                const text = button.textContent.trim();
                const ariaLabel = button.getAttribute('aria-label');
                
                if (!text && !ariaLabel) {
                    this.issues.push('Button missing accessible name');
                }
            });
        }

        // Validate video accessibility
        validateVideo() {
            const videos = this.widget.querySelectorAll('video');
            videos.forEach(video => {
                // Check for captions
                const captions = video.querySelectorAll('track[kind="captions"]');
                if (captions.length === 0) {
                    this.issues.push('Video missing captions track');
                }

                // Check for audio descriptions
                const descriptions = video.querySelectorAll('track[kind="descriptions"]');
                if (descriptions.length === 0) {
                    this.warnings.push('Video missing audio descriptions track');
                }

                // Check controls
                if (!video.hasAttribute('controls')) {
                    this.warnings.push('Video should have controls attribute');
                }

                // Check autoplay
                if (video.hasAttribute('autoplay')) {
                    this.warnings.push('Avoid autoplay for accessibility - users should control media playback');
                }
            });
        }

        // Validate form accessibility
        validateForm() {
            const forms = this.widget.querySelectorAll('form');
            forms.forEach(form => {
                // Check for proper labeling
                const formLabel = form.getAttribute('aria-labelledby') || form.getAttribute('aria-label');
                if (!formLabel) {
                    this.warnings.push('Form should have accessible name');
                }

                // Check error messages
                const errorElements = form.querySelectorAll('[role="alert"], .error-message');
                const requiredInputs = form.querySelectorAll('input[required], textarea[required], select[required]');
                
                requiredInputs.forEach(input => {
                    const ariaDescribedBy = input.getAttribute('aria-describedby');
                    if (!ariaDescribedBy) {
                        this.warnings.push('Required input should be associated with error message');
                    }
                });
            });
        }

        // Check for minimum touch target size (44px)
        validateTouchTargets() {
            const interactiveElements = this.widget.querySelectorAll(
                'button, input, select, textarea, a[href], [role="button"]'
            );

            interactiveElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                if (rect.width < 44 || rect.height < 44) {
                    this.warnings.push(`Touch target too small (${Math.round(rect.width)}x${Math.round(rect.height)}px): ${element.tagName}`);
                }
            });
        }

        // Report validation results
        reportResults() {
            const total = this.issues.length + this.warnings.length;
            
            if (total === 0) {
                console.log('✅ ASL Now Widget: No accessibility issues found!');
                return;
            }

            console.group('🎯 ASL Now Widget Accessibility Report');
            
            if (this.issues.length > 0) {
                console.group(`❌ Issues (${this.issues.length})`);
                this.issues.forEach(issue => console.error(issue));
                console.groupEnd();
            }

            if (this.warnings.length > 0) {
                console.group(`⚠️ Warnings (${this.warnings.length})`);
                this.warnings.forEach(warning => console.warn(warning));
                console.groupEnd();
            }

            console.groupEnd();

            // Show user-friendly notification if there are critical issues
            if (this.issues.length > 0) {
                this.showAccessibilityNotification();
            }
        }

        // Show accessibility notification to users
        showAccessibilityNotification() {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: #d63384;
                color: white;
                padding: 10px;
                border-radius: 5px;
                z-index: 10000;
                font-family: Arial, sans-serif;
                font-size: 14px;
                max-width: 300px;
            `;
            notification.innerHTML = `
                <strong>Accessibility Issues Detected</strong><br>
                ${this.issues.length} issue(s) found in ASL Now widget.
                <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; color: white; cursor: pointer;">×</button>
            `;
            document.body.appendChild(notification);

            // Auto-remove after 10 seconds
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 10000);
        }
    }

    // Initialize accessibility validation when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            const validator = new AccessibilityValidator();
            validator.init();
        });
    } else {
        const validator = new AccessibilityValidator();
        validator.init();
    }

    // Export for manual testing
    window.ASLNowAccessibilityValidator = AccessibilityValidator;

})();
