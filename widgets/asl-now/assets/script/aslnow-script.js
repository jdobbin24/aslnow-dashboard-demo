(function () {
    let ASLNow = document.getElementById("ASLNow");
    if (!ASLNow) return;

    ASLNow.tabIndex = -1; // Make the widget focusable but not in tab order initially
    
    // Store the element that had focus before opening the widget
    let lastFocusedElement = null;

    // Handle keyboard interaction
    ASLNow.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeWidget();
        }
    });
    
    // Function to close widget and restore focus
    function closeWidget() {
        ASLNow.setAttribute("display", "false");
        ASLNow.setAttribute("displayContactList", "false");
        ASLNow.setAttribute("displayContactInfo", "false");
        ASLNow.setAttribute("aria-hidden", "true");
        
        // Restore focus to the trigger button
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }
    
    // Function to open widget and manage focus
    function openWidget() {
        lastFocusedElement = document.activeElement;
        ASLNow.setAttribute("display", "true");
        ASLNow.setAttribute("displayContactList", "true");
        ASLNow.setAttribute("displayContactInfo", "false");
        ASLNow.setAttribute("aria-hidden", "false");
        
        // Focus the widget container for screen readers
        setTimeout(() => {
            ASLNow.focus();
        }, 100);
    }

    if (!ASLNow.hasAttribute('position')) ASLNow.setAttribute('position', 'bottom-right');
    if (!ASLNow.hasAttribute('direction')) ASLNow.setAttribute('direction', 'ltr');
    if (!ASLNow.hasAttribute('icon')) ASLNow.setAttribute('icon', 'whatsapp');
    if (!ASLNow.hasAttribute('theme')) ASLNow.setAttribute('theme', 'light');
    if (!ASLNow.hasAttribute('display')) {
        ASLNow.setAttribute('display', 'false');
    } else if (ASLNow.getAttribute('display') == "true") {
        ASLNow.setAttribute('displayContactList', 'true')
        ASLNow.setAttribute('displayContactInfo', 'false')
    }
    let ASLNow_elements = {
        contactListContainer: (ASLNow.querySelector(".ASLNow_contactList") || null),
        contactInfo: (ASLNow.querySelectorAll(".ASLNow_contactInfo") || []),
        btn: (ASLNow.querySelector(".ASLNow_btn") || null),
    };

    if (Object.values(ASLNow_elements).some(el => el === null)) return;

    ASLNow_elements.contactList = (ASLNow_elements.contactListContainer.querySelectorAll("li") || []);
    ASLNow_elements.backToList = (ASLNow.querySelectorAll(".ASLNow_contactInfo_backToList") || []);

    // Enhanced click handler with aria-expanded management
    ASLNow_elements.btn.onclick = function () {
        if (ASLNow.getAttribute("display") == "true") {
            closeWidget();
            ASLNow_elements.btn.setAttribute("aria-expanded", "false");
        } else {
            openWidget();
            ASLNow_elements.btn.setAttribute("aria-expanded", "true");
        }
    }
    
    // Add keyboard support for the main button
    ASLNow_elements.btn.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.click();
        }
    });

    // Enhanced contact list interaction with keyboard support
    ASLNow_elements.contactList.forEach(function (contactListItem) {
        const button = contactListItem.querySelector('.service-option-btn');
        
        function handleSelection(event) {
            let targetName = event.target.closest("li").getAttribute("info-target-name");
            if (!targetName) return;

            let infoTarget = null;
            [...ASLNow_elements.contactInfo].forEach(function (contactInfoItem) {
                contactInfoItem.setAttribute("display", "false");
                if (contactInfoItem.getAttribute("info-name") == targetName)
                    infoTarget = contactInfoItem;
            });
            if (!infoTarget) return;

            ASLNow.setAttribute("displayContactList", "false");
            ASLNow.setAttribute("displayContactInfo", "true");
            infoTarget.setAttribute("display", "true");
            
            // Focus the back button for easier navigation
            setTimeout(() => {
                const backButton = infoTarget.querySelector('.ASLNow_contactInfo_backToList');
                if (backButton) backButton.focus();
            }, 100);
        }
        
        contactListItem.onclick = handleSelection;
        
        // Add keyboard support for service option buttons
        if (button) {
            button.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleSelection(event);
                }
            });
        }
    });

    // Enhanced back to list functionality with keyboard support
    ASLNow_elements.backToList.forEach(function (backToListItem) {
        function goBackToList() {
            [...ASLNow_elements.contactInfo].forEach(function (contactInfoItem) {
                contactInfoItem.setAttribute("display", "false");
            });
            ASLNow.setAttribute("displayContactList", "true");
            ASLNow.setAttribute("displayContactInfo", "false");
            
            // Focus the first service option button
            setTimeout(() => {
                const firstButton = ASLNow.querySelector('.service-option-btn');
                if (firstButton) firstButton.focus();
            }, 100);
        }
        
        backToListItem.onclick = goBackToList;
        
        // Add keyboard support for back buttons
        backToListItem.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                goBackToList();
            }
        });
    });

})();

// Enhanced video handling for accessibility
var aud = document.getElementById("aslnowVideo");
var playCount = 0;

if (aud) {
    // Remove autoplay for better accessibility
    aud.removeAttribute('autoplay');
    
    // Add user-controlled play functionality
    aud.onended = function() {
        playCount++;
        // Don't auto-replay - let users control playback
        console.log('Video ended. Play count:', playCount);
    };
    
    // Add keyboard support for video controls
    aud.addEventListener('keydown', function(event) {
        switch(event.key) {
            case ' ': // Spacebar
            case 'k': // K key (common video shortcut)
                event.preventDefault();
                if (this.paused) {
                    this.play();
                } else {
                    this.pause();
                }
                break;
            case 'm': // M key for mute
                event.preventDefault();
                this.muted = !this.muted;
                break;
        }
    });
}



function changeImage() {
    var image = document.getElementById('aslImg');
    if (image.src.match("./assets/images/aslnow/asl-now-horizontal-color.png")) {
        image.src = "./assets/images/aslnow/asl-now-horizontal-color.png";
    }
    else {
        image.src = "./assets/images/aslnow/asl-now-horizontal-color.png";
    }
};
