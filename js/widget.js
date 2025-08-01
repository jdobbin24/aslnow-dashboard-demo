(function() {
    'use strict';
    
    // Configuration
    const WIDGET_API_BASE = window.location.origin;
    const WIDGET_DOMAIN = window.ASL_NOW_DOMAIN || window.location.hostname;
    
    // Widget data storage
    let widgetData = null;
    let widgetElement = null;
    let isWidgetOpen = false;
    
// Initialize widget
function initWidget() {
    fetchWidgetData()
        .then(data => {
            widgetData = data;
            // Determine which widget type to use
            if (widgetData && widgetData.theme && widgetData.theme.widget_type === 'asl_now') {
                createWidgetVersion2();
            } else {
                createWidget();
            }
            attachEventListeners();
        })
        .catch(error => {
            console.error('Failed to initialize ASL Now widget:', error);
        });
}
    
    // Fetch widget configuration from API
    function fetchWidgetData() {
        return fetch(`${WIDGET_API_BASE}/api/widget?domain=${WIDGET_DOMAIN}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            });
    }
    
// Create widget HTML structure for Version 1
function createWidget() {
    const theme = widgetData.theme || {};
    const org = widgetData.organization || {};

    // Create widget container
    widgetElement = document.createElement('div');
    widgetElement.id = 'asl-now-widget';
    widgetElement.innerHTML = `
        <div class="widget-tab" id="widget-tab">
            <span class="widget-title">${theme.tab_text || 'ASL Now Version 1'}</span>
            <button class="widget-close" id="widget-close" style="display: none;">&times;</button>
        </div>
        <div class="widget-panel" id="widget-panel">
            <div class="widget-content">
                <div class="widget-buttons">
                    <button class="widget-btn asl-btn" id="asl-btn">
                        <svg class="dcaslchaticon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 49.5" style="width: 24px; height: 24px;"><path d="M44.6 23.9c1.3-0.9 2.1-2.3 2.1-3.9 0-2.6-2.1-4.8-4.8-4.8s-4.8 2.1-4.8 4.8c0 2.2 1.5 4.1 3.6 4.6 -2.5 1.2-4.3 3.9-4.3 6.9l-0.1 3.4 11-4.9C47.4 29.9 47.8 24.8 44.6 23.9z" /><path d="M66 11.4c0-0.9-0.9-1.3-1.8-0.9l-5.1 2.7c-0.5 0.3-0.9 0.8-0.9 1.4l0.1 4.5c0 0.6 0.4 1 0.9 1.1l5.1 0.8c0.9 0.1 1.8-0.7 1.7-1.5L66 11.4z" /><path d="M53.5 4.6L38.8 9.9c-1.1 0.4-1.6 1.7-1.1 2.7v0c0.5 0.9 1.5 1.3 2.4 0.9l12.1-4.4v20.8l-2.1 1c-0.7 0.3-1.1 1-1.1 1.8l0 4.2 -3.3-2.8c-0.6-0.5-1.4-0.6-2.1-0.3L32.9 39l-1.5 0.7v-3.4 -1h1c0.2 0 0.4-0.1 0.6-0.2 0.1 0 0.1-0.1 0.1-0.2 0.1-0.1 0.1-0.3 0.1-0.4 0-0.1 0-0.3-0.1-0.4 0 0 0 0 0 0l-3-4.5c-0.1-0.2-0.3-0.2-0.5-0.3 -0.1-0.1-0.2-0.1-0.4-0.1 -0.3 0-0.5 0.2-0.7 0.4L25.6 34c0 0.1-0.1 0.2-0.1 0.3 0 0.2 0 0.4 0.1 0.6 0.1 0.2 0.3 0.4 0.6 0.4 0.1 0 0.2 0.1 0.3 0.1h0.8v2.4 5.1c0 0.4 0.1 0.8 0.4 1.2 0.3 0.4 0.7 0.7 1.2 0.8 0.2 0.1 0.4 0.1 0.6 0.1 0.3 0 0.6-0.1 0.8-0.2l13.9-6.8 5.5 4.7c0.7 0.6 1.7 0.6 2.5 0 0.5-0.4 0.7-1 0.7-1.6l-0.1-7.1 2.1-1c0.7-0.3 1.1-1 1.1-1.8V6.5c0-0.4-0.1-0.8-0.3-1.1C55.3 4.6 54.3 4.3 53.5 4.6z" /><path d="M20.7 26.7c0 0 0 0 0 0 -0.1 0-0.2 0-0.3 0 1.5-0.8 2.5-2.4 2.5-4.2 0-2.6-2.1-4.8-4.8-4.8s-4.8 2.1-4.8 4.8c0 2.3 1.6 4.2 3.7 4.6 -3.1 1.5-3.8 5.7-3.8 8.9l10.7-3.4C24 32.6 24.4 27.2 20.7 26.7z" /><path d="M32.9 35c0.1 0 0.1-0.1 0.1-0.2 0-0.1 0.1-0.1 0.1-0.2 0 0.1 0 0.1-0.1 0.2C33 34.9 33 35 32.9 35z" /><path d="M35.7 14.2c-0.1-0.3-0.4-0.4-0.7-0.4h-1v-2.5V6.2c0-0.4-0.1-0.8-0.4-1.2 -0.4-0.5-1-0.8-1.6-0.8 -0.3 0-0.6 0.1-0.8 0.2 0 0 0 0 0 0L25.3 7.3l-8.2 3.9 -5.5-4.7c-0.7-0.6-1.7-0.6-2.5 0C8.6 6.9 8.4 7.5 8.4 8.1l0.1 7.1L6.3 16.1c-0.7 0.3-1.1 1-1.1 1.8v24.7c0 0.4 0.1 0.8 0.3 1.1 0 0 0 0 0 0l0 0c0.5 0.8 1.5 1.1 2.3 0.8l14.4-5.2c1.1-0.4 1.6-1.6 1.1-2.6v0c-0.4-0.9-1.4-1.3-2.4-1L9.1 39.9V21l0 0v-0.7l0 0v-1.1l0 0v0l2.1-1c0.7-0.3 1.2-1 1.1-1.8l0-4.2 3.3 2.8c0 0 0 0 0.1 0 0.6 0.5 1.4 0.6 2 0.2l12.4-6v3.4 1.1 0H29.1c-0.1 0-0.3 0-0.4 0.1 -0.1 0.1-0.2 0.2-0.3 0.3 -0.1 0.3-0.1 0.6 0.1 0.8l0 0 3 4.4c0.2 0.2 0.4 0.3 0.7 0.4 0.1 0 0.3 0 0.4-0.1 0.1-0.1 0.2-0.1 0.3-0.3l2.8-4.5c0.1-0.1 0.1-0.2 0.1-0.2C35.8 14.6 35.8 14.4 35.7 14.2z" /></svg>
                        <span>${theme.asl_button_text || 'ASL Chat'}</span>
                    </button>
                    <button class="widget-btn text-chat-btn" id="text-chat-btn">
                        <svg class="dctextchaticon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 49.5" style="width: 24px; height: 24px;"><path d="M59.1 3.7L43.8 9.2c-1.1 0.4-1.7 1.8-1.1 2.8l0 0c0.5 0.9 1.5 1.3 2.5 1l12.6-4.6v21.7l-2.2 1c-0.7 0.3-1.2 1.1-1.2 1.9l0 4.4 -3.4-2.9c-0.6-0.5-1.5-0.6-2.2-0.3l-11.2 5.4L36 40.4v-3.5 -1.1h1c0.2 0 0.5-0.1 0.6-0.3 0.1-0.1 0.1-0.1 0.1-0.2 0.1-0.1 0.1-0.3 0.1-0.4 0-0.1-0.1-0.3-0.1-0.4 0 0 0 0 0 0l-3.2-4.7c-0.1-0.2-0.3-0.3-0.5-0.3 -0.1-0.1-0.3-0.1-0.4-0.1 -0.3 0-0.5 0.2-0.7 0.4l-2.9 4.7c0 0.1-0.1 0.2-0.1 0.3 0 0.2 0 0.4 0.1 0.6 0.1 0.2 0.4 0.4 0.6 0.4 0.1 0 0.2 0.1 0.3 0.1h0.9v2.5 5.3c0 0.4 0.1 0.9 0.4 1.2 0.3 0.4 0.8 0.7 1.2 0.8 0.2 0.1 0.4 0.1 0.6 0.1 0.3 0 0.6-0.1 0.9-0.2l14.5-7.1 5.8 4.9c0.7 0.6 1.8 0.7 2.6 0 0.5-0.4 0.7-1 0.7-1.6l-0.1-7.4 2.2-1c0.7-0.3 1.2-1 1.2-1.8V5.7c0-0.4-0.1-0.8-0.3-1.1C61 3.7 60 3.4 59.1 3.7z" /><path d="M37.6 35.5c0.1-0.1 0.1-0.1 0.1-0.2 0-0.1 0.1-0.1 0.1-0.2 0 0.1 0 0.2-0.1 0.2C37.7 35.4 37.7 35.4 37.6 35.5z" /><path d="M40.5 13.8c-0.1-0.3-0.4-0.4-0.7-0.4h-1.1v-2.6V5.4c0-0.4-0.1-0.9-0.4-1.2 -0.4-0.6-1-0.8-1.6-0.8 -0.3 0-0.6 0.1-0.9 0.2 0 0 0 0 0 0l-6.1 3 -8.5 4.1 -5.8-4.9c-0.7-0.6-1.8-0.6-2.6 0 -0.5 0.4-0.7 1-0.7 1.7l0.1 7.4 -2.2 1c-0.7 0.3-1.2 1.1-1.2 1.8v25.8c0 0.4 0.1 0.8 0.3 1.2 0 0 0 0 0 0l0 0c0.5 0.8 1.5 1.1 2.4 0.9l15-5.4c1.1-0.4 1.7-1.7 1.1-2.8l0 0c-0.4-0.9-1.5-1.3-2.5-1L12.7 40.6V20.8l0 0v-0.8l0 0v-1.2l0 0v0l2.2-1c0.7-0.3 1.2-1.1 1.2-1.9l0-4.4 3.4 2.9c0 0 0 0 0.1 0 0.6 0.5 1.4 0.6 2.1 0.3l13-6.2v3.6 1.2 0h-1c-0.1 0-0.3 0-0.4 0.1 -0.1 0.1-0.2 0.2-0.3 0.3 -0.1 0.3-0.1 0.6 0.1 0.9l0 0 3.2 4.6c0.2 0.2 0.4 0.3 0.7 0.4 0.2 0 0.3 0 0.4-0.1 0.1-0.1 0.2-0.2 0.3-0.3l2.9-4.7c0.1-0.1 0.1-0.2 0.1-0.2C40.6 14.2 40.6 14 40.5 13.8z" /><path d="M41.7 30.4c-0.5 0-1-0.3-1.2-0.8 -0.2-0.7 0.1-1.4 0.7-1.6l12.1-4.5c0.7-0.2 1.4 0.1 1.6 0.7 0.3 0.7-0.1 1.4-0.7 1.6l-12.1 4.5C42 30.4 41.8 30.4 41.7 30.4z" /><path d="M41.3 23.9c-0.5 0-1-0.3-1.2-0.8 -0.2-0.7 0.1-1.4 0.8-1.6l11.9-4.3c0.7-0.2 1.4 0.1 1.6 0.8 0.2 0.7-0.1 1.4-0.8 1.6L41.7 23.8C41.6 23.8 41.4 23.9 41.3 23.9z" /><path d="M17.9 31.8c-0.5 0-1-0.3-1.2-0.8 -0.2-0.7 0.1-1.4 0.8-1.6l12.1-4.4c0.7-0.2 1.4 0.1 1.6 0.8s-0.1 1.4-0.8 1.6l-12.1 4.4C18.2 31.8 18 31.8 17.9 31.8z" /><path d="M17.5 25.3c-0.5 0-1-0.3-1.2-0.8 -0.2-0.7 0.1-1.4 0.8-1.6l11.9-4.2c0.7-0.2 1.4 0.1 1.6 0.8 0.2 0.7-0.1 1.4-0.8 1.6L17.9 25.2C17.8 25.3 17.6 25.3 17.5 25.3z" /></svg>
                        <span>${theme.text_chat_button_text || 'Text Chat'}</span>
                    </button>
                </div>
                <div class="widget-support-link" style="margin-top:16px;text-align:center;">
                    <a href="https://aslnow.com/tech-support/" target="_blank" style="color:#007cba;text-decoration:underline;font-size:14px;">
                        Can't Connect?
                    </a>
                </div>
            </div>
        </div>
    `;

    // Apply positioning
    const position = theme.position || 'bottom-right';
    widgetElement.className = `asl-widget asl-widget-${position}`;

    // Inject CSS
    injectCSS(theme, org);

    // Add to page
    document.body.appendChild(widgetElement);

    // Initialize attention animation after widget is added
    setTimeout(() => {
        const tab = document.getElementById('widget-tab');
        if(tab && !isWidgetOpen) tab.classList.add('tab-attention');
    }, 100);
}

// Create widget HTML structure for Version 2
function createWidgetVersion2() {
    const theme = widgetData.theme || {};
    const org = widgetData.organization || {};

    // Build video element if video file path exists
    const videoElement = theme.video_file_path ? 
        `<div class="widget-video">
            <video width="100%" height="180" autoplay muted loop>
                <source src="/storage/${theme.video_file_path}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>` : '';

    // Create widget container
    widgetElement = document.createElement('div');
    widgetElement.id = 'asl-now-widget';
    widgetElement.innerHTML = `
        <div class="widget-tab" id="widget-tab">
            <span class="widget-title">${theme.asl_now_header_text || 'ASL Now Version 2'}</span>
            <button class="widget-close" id="widget-close" style="display: none;">&times;</button>
        </div>
        <div class="widget-panel" id="widget-panel">
            <div class="widget-content">
                <div class="widget-header-title">
                    ${theme.show_logos && theme.logo_image_path ? `<img src="/storage/${theme.logo_image_path}" alt="Logo" style="max-height: 30px; display: block; margin: 0 auto 10px;" />` : ''}
                    <h3>${theme.asl_now_header_text || 'ASL Customer Service'}</h3>
                </div>
                ${videoElement}
                <div class="widget-description">
                    ${theme.asl_now_description || 'You can connect with our representative via live video in ASL or via text chat.'}
                </div>
                <div class="widget-buttons">
                    <button class="widget-btn video-chat-btn" id="video-chat-btn">
                    <svg class="video-chat-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 24px; height: 24px;">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
</svg>
                    <span>${theme.video_chat_button_text || 'Video Chat'}</span>
                </button>
                <button class="widget-btn text-chat-btn" id="text-chat-btn-v2">
                    <svg class="text-chat-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 24px; height: 24px;">
    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
</svg>
                    <span>Text Chat</span>
                </button>
                </div>
            </div>
        </div>
    `;

    // Apply positioning
    const position = theme.position || 'bottom-right';
    widgetElement.className = `asl-widget asl-widget-${position} version-2`;

    // Inject CSS
    injectCSS(theme, org);

    // Add to page
    document.body.appendChild(widgetElement);

    // Initialize attention animation after widget is added
    setTimeout(() => {
        const tab = document.getElementById('widget-tab');
        if(tab && !isWidgetOpen) tab.classList.add('tab-attention');
    }, 100);
}
    
    // Inject widget styles
    function injectCSS(theme, org) {
        const css = `
            .asl-widget {
                position: fixed;
                z-index: 999999;
                font-family: Arial, sans-serif;
            }
            
            .asl-widget-bottom-right {
                bottom: 200px;
                right: 20px;
            }
            
            .asl-widget-bottom-left {
                bottom: 200px;
                left: 20px;
            }
            
            .asl-widget-top-right {
                top: 200px;
                right: 20px;
            }
            
            .asl-widget-top-left {
                top: 20px;
                left: 20px;
            }
            
            .widget-tab {
                display: flex;
                align-items: center;
                justify-content: space-around;
                background-color: ${theme.tab_background_color || theme.primary_color || '#007cba'};
                color: ${theme.tab_text_color || '#ffffff'};
                padding: 12px 8px 12px 20px;
                border-radius: 25px 25px 0 25px;
                cursor: pointer;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
                user-select: none;
                opacity: 0.85;
                width: 160px;
                min-width: 160px;
                margin-left: auto;
            }
            
            .widget-tab.widget-open {
                opacity: 1;
                width: 280px;
                min-width: 280px;
            }

            @keyframes pulse-shadow {
                0% {
                    box-shadow: 0 0 0 0 ${theme.tab_background_color || theme.primary_color || '#007cba'}80, 0 2px 10px rgba(0,0,0,0.2);
                }
                70% {
                    box-shadow: 0 0 0 12px ${theme.tab_background_color || theme.primary_color || '#007cba'}15, 0 2px 10px rgba(0,0,0,0.2);
                }
                100% {
                    box-shadow: 0 0 0 0 ${theme.tab_background_color || theme.primary_color || '#007cba'}00, 0 2px 10px rgba(0,0,0,0.2);
                }
            }
            .widget-tab.tab-attention {
                animation: pulse-shadow 3s 3 cubic-bezier(0.4,0,0.4,1);
            }
            
            .widget-tab:hover {
                background-color: ${theme.tab_background_color || theme.secondary_color || '#005a87'};
                opacity: 0.9;
                transform: translateY(-2px);
            }
            
            .widget-title {
                font-weight: bold;
                font-size: 14px;
            }
            
            .widget-panel {
                background-color: ${theme.background_color || '#ffffff'};
                border: 1px solid #ddd;
                border-radius: 25px 0 25px 25px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                margin-top: 5px;
                min-width: 280px;
                overflow: hidden;
                max-height: 0;
                opacity: 0;
                transition: max-height 0.4s ease, opacity 0.4s ease;
                position: static;
            }
            
            /* Version 2 specific panel width */
            .version-2 .widget-panel {
                min-width: 360px;
                width: 360px;
            }

            .widget-panel.open {
                max-height: 600px;
                opacity: 1;
            }
            
            .version-2 .widget-panel.open {
                max-height: 700px;
            }
            
            .widget-header {
                background-color: ${theme.primary_color || '#007cba'};
                color: ${theme.text_color || '#ffffff'};
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .widget-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: bold;
            }
            
            .widget-close {
                background: none;
                border: none;
                color: ${theme.tab_text_color || '#ffffff'};
                font-size: 24px;
                cursor: pointer;
                padding: 0 5px;
            }
            
            .widget-close:hover {
                background-color: rgba(255,255,255,0.2);
            }
            
            .widget-content {
                padding: 20px;
            }
            
            /* Version 2 specific styles */
            .version-2 .widget-header-title {
                text-align: center;
                margin-bottom: 15px;
            }
            
            .version-2 .widget-header-title h3 {
                margin: 0;
                font-size: 18px;
                font-weight: bold;
                color: #333;
            }
            
            .version-2 .widget-video {
                margin-bottom: 15px;
                border-radius: 8px;
                overflow: hidden;
                background: #000;
            }
            
            .version-2 .widget-video video {
                display: block;
                border-radius: 8px;
            }
            
            .version-2 .widget-description {
                margin-bottom: 20px;
                font-size: 14px;
                color: #666;
                text-align: center;
                line-height: 1.4;
            }
            
            .widget-buttons {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            
            .widget-btn {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 15px 20px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: 500;
                transition: all 0.2s ease;
                text-decoration: none;
                color: inherit;
                justify-content: center;
            }
            
            .widget-btn svg {
                flex-shrink: 0;
                width: 30px !important;
                height: 30px !important;
            }
            
            /* Version 1 buttons */
            .asl-btn {
                background-color: ${theme.primary_color || '#007cba'};
                color: ${theme.asl_button_text_color || '#ffffff'};
            }
            
            .asl-btn:hover {
                background-color: ${theme.asl_button_hover_color || '#005a87'};
                transform: translateY(-1px);
            }
            
            .asl-btn svg {
                fill: ${theme.asl_icon_color || '#ffffff'} !important;
            }
            
            .text-chat-btn {
                background-color: ${theme.secondary_color || '#28a745'};
                color: ${theme.text_chat_button_text_color || '#ffffff'};
            }
            
            .text-chat-btn:hover {
                background-color: ${theme.text_chat_button_hover_color || '#1e7e34'};
                transform: translateY(-1px);
            }
            
            .text-chat-btn svg {
                fill: ${theme.text_chat_icon_color || '#ffffff'} !important;
            }
            
            /* Version 2 buttons */
            .video-chat-btn {
                background-color: ${theme.primary_color || '#007cba'};
                color: ${theme.asl_button_text_color || '#ffffff'};
            }
            
            .video-chat-btn:hover {
                background-color: ${theme.asl_button_hover_color || '#005a87'};
                transform: translateY(-1px);
            }
            
            .video-chat-btn svg {
                fill: ${theme.asl_icon_color || '#ffffff'} !important;
            }
            
            /* Version 2 text chat button */
            .version-2 .text-chat-btn {
                background-color: ${theme.secondary_color || '#28a745'};
                color: ${theme.text_chat_button_text_color || '#ffffff'};
            }
            
            .version-2 .text-chat-btn:hover {
                background-color: ${theme.text_chat_button_hover_color || '#1e7e34'};
                transform: translateY(-1px);
            }
            
            .version-2 .text-chat-btn svg {
                fill: ${theme.text_chat_icon_color || '#ffffff'} !important;
            }
            
            .contact-me-btn {
                background-color: ${theme.secondary_color || '#28a745'};
                color: ${theme.text_color || '#ffffff'};
            }
            
            .contact-me-btn:hover {
                background-color: ${theme.text_chat_button_hover_color || '#1e7e34'};
                transform: translateY(-1px);
            }
            
            @media (max-width: 768px) {
                .asl-widget {
                    bottom: 10px !important;
                    right: 10px !important;
                    left: 10px !important;
                    top: auto !important;
                }
                
                .widget-panel {
                    min-width: auto;
                    width: 100%;
                }
            }
        `;
        
        const styleElement = document.createElement('style');
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
    }
    
    // Attach event listeners
    function attachEventListeners() {
        const tab = document.getElementById('widget-tab');
        const panel = document.getElementById('widget-panel');
        const closeBtn = document.getElementById('widget-close');
        const aslBtn = document.getElementById('asl-btn');
        const textChatBtn = document.getElementById('text-chat-btn');
        const videoChatBtn = document.getElementById('video-chat-btn');
        const contactMeBtn = document.getElementById('contact-me-btn');
        
        // Toggle widget panel
        if (tab) tab.addEventListener('click', toggleWidget);
        if (closeBtn) closeBtn.addEventListener('click', closeWidget);
        
        // Version 1 button actions
        if (aslBtn) {
            aslBtn.addEventListener('click', () => {
                if (widgetData.organization.asl_url) {
                    window.open(widgetData.organization.asl_url, '_blank');
                }
            });
        }
        
        if (textChatBtn) {
            textChatBtn.addEventListener('click', () => {
                if (widgetData.organization.message_us_url) {
                    window.open(widgetData.organization.message_us_url, '_blank');
                }
            });
        }
        
        // Version 2 button actions
        if (videoChatBtn) {
            videoChatBtn.addEventListener('click', () => {
                if (widgetData.organization.asl_url) {
                    window.open(widgetData.organization.asl_url, '_blank');
                }
            });
        }
        
        // Version 2 text chat button (different ID to avoid conflicts)
        const textChatBtnV2 = document.getElementById('text-chat-btn-v2');
        if (textChatBtnV2) {
            textChatBtnV2.addEventListener('click', () => {
                if (widgetData.organization.message_us_url) {
                    window.open(widgetData.organization.message_us_url, '_blank');
                }
            });
        }
        
        if (contactMeBtn) {
            contactMeBtn.addEventListener('click', () => {
                if (widgetData.organization.message_us_url) {
                    window.open(widgetData.organization.message_us_url, '_blank');
                }
            });
        }
        
        // Close widget when clicking outside
        document.addEventListener('click', (e) => {
            if (isWidgetOpen && !widgetElement.contains(e.target)) {
                closeWidget();
            }
        });
        
        // Auto-open if configured
        if (widgetData.theme && widgetData.theme.auto_open) {
            setTimeout(openWidget, 1000);
        }
    }
    
    // Toggle widget visibility
    function toggleWidget() {
        if (isWidgetOpen) {
            closeWidget();
        } else {
            openWidget();
        }
    }
    
    // Open widget
    function openWidget() {
        const panel = document.getElementById('widget-panel');
        const closeBtn = document.getElementById('widget-close');
        const tab = document.getElementById('widget-tab');
        if (panel) {
            panel.classList.add('open');
            closeBtn.style.display = 'inline-block';
            if(tab) {
                tab.classList.remove('tab-attention');
                tab.classList.add('widget-open');
            }
            isWidgetOpen = true;
        }
    }
    
    // Close widget
    function closeWidget() {
        const panel = document.getElementById('widget-panel');
        const closeBtn = document.getElementById('widget-close');
        const tab = document.getElementById('widget-tab');
        if (panel) {
            panel.classList.remove('open');
            closeBtn.style.display = 'none';
            if(tab) {
                tab.classList.add('tab-attention');
                tab.classList.remove('widget-open');
            }
            isWidgetOpen = false;
        }
    }

    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }
})();
