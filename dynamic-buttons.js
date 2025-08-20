// Dynamic Buttons Script
// This script adds custom buttons to the Advance Auto Parts page

(function() {
    'use strict';
    
    let buttonsInitialized = false;
    let observer = null;
    let viewer3DInitialized = false; // Add flag to prevent multiple 3D viewer initializations
    
    // Wait for the DOM to be fully loaded
    function waitForElement(selector, callback, maxTries = 50) {
        if (maxTries <= 0) return;
        
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            setTimeout(() => waitForElement(selector, callback, maxTries - 1), 100);
        }
    }
    
    // Create and inject custom CSS styles
    function injectCustomStyles() {
        // Check if styles are already injected
        if (document.querySelector('#custom-buttons-styles')) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'custom-buttons-styles';
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap');
            
            .custom-button-container {
                display: flex;
                gap: 12px;
                margin: 16px 0;
                justify-content: flex-start;
                flex-wrap: nowrap;
                align-items: center;
            }
            
            .custom-button {
                padding: 16px 40px;
                border: none;
                border-radius: 6px;
                font-size: 16px;
                font-weight: 600;
                font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                cursor: pointer;
                transition: all 0.2s ease;
                letter-spacing: 0.5px;
                min-width: 160px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 7px;
                flex-shrink: 0;
            }
            
            .custom-button:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            
            .custom-button:active {
                transform: translateY(0);
            }
            
            .custom-button.primary {
                background: #FFCC00;
                color: black;
            }
            
            .custom-button.secondary {
                background: #FFCC00;
                color: black;
            }
            
            .custom-button svg {
                width: 16px;
                height: 16px;
            }
            
            .custom-button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }
            
            .custom-button:disabled:hover {
                transform: none;
                box-shadow: none;
            }
            
            .ar-button-container {
                gap: 8px;
                margin-bottom: 8px;
                margin-left: 0;
                margin-right: 0;
                padding: 4px;
                transform: translate(-50px, 0px);
                align-items: center;
                /* Add these properties for precise positioning control */
                position: relative;
                /* You can adjust these values to move the button around */
                /* top: 0px; */
                /* left: 0px; */
                /* right: 0px; */
                /* bottom: 100px; */
            }
            
            .ar-button {
                padding: 8px;
                border: 1px solid black;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 600;
                font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                cursor: pointer;
                transition: all 0.2s ease;
                background: white;
                color: black;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            
            .ar-button:hover {
                background: #f8f9fa;
                color: #333;
                border-color: #dee2e6;
                transform: translateY(-1px);
            }
            
            .ar-button svg {
                width: 14px;
                height: 14px;
            }
            
            /* Utility classes for different AR button positions */
            .ar-button-container.position-top {
                margin-top: 0;
                margin-bottom: 16px;
            }
            
            .ar-button-container.position-bottom {
                margin-top: 16px;
                margin-bottom: 0;
            }
            
            .ar-button-container.position-left {
                justify-content: flex-start;
                margin-left: 0;
                margin-right: auto;
            }
            
            .ar-button-container.position-right {
                justify-content: flex-end;
                margin-left: auto;
                margin-right: 0;
            }
            
            .ar-button-container.position-center {
                justify-content: center;
                margin-left: auto;
                margin-right: auto;
            }
            
            .ar-button-container.position-absolute {
                position: absolute;
                top: 10px;
                right: 10px;
                z-index: 10;
            }
            
            /* Modal styles */
            .modal-overlay {
                position: absolute;
                top: 0;
                bottom: 40rem;

                width: 80vw;
                height: 70vh;
                background: transparent;
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            
            .modal-overlay.show {
                display: flex;
            }
            
            .modal-overlay.small {
                width: 330px;
                height: 330px;
                top: 5rem;
                box-shadow: none;
                border: none;
            }
            
            .modal-content {
                background: white;
                padding: 0;
                border-radius: 8px;
                width: 100%;
                height: 100%;
                overflow: hidden;
                position: relative;
            }
            
            /* Add box shadow and border only for main modal */
            .modal-overlay:not(.small) .modal-content {
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                border: 1px solid #ddd;
            }
            
            .modal-close {
                position: absolute;
                top: 10px;
                right: 15px;
                background: rgba(255, 255, 255, 0.9);
                border: none;
                font-size: 35px;
                font-style: bold;
                cursor: pointer;
                color: #666;
                padding: 8px;
                line-height: 1;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .modal-close:hover {
                color: #000;
            }
            
            /* Ensure parent container has relative positioning for close button */
            .css-1xvhojq {
                position: relative;
            }
            
            /* Hide image when modal is open */
            .image-hidden {
                opacity: 0.3;
                pointer-events: none;
            }
            
            @media (min-width:768px) and (max-width: 1023px) {
                .custom-button-container {
                    flex-direction: column;
                    align-items: flex-start;
                }
                
                .custom-button {
                    width: 100%;
                    max-width: 280px;
                }
                
                .ar-button-container {
                    flex-direction: column;
                    align-items: flex-start;
                }
                
                /* Tablet responsive modal */
                .modal-overlay {
                    width: 90vw;
                    height: 80vh;
                    top: 10vh;
                    bottom: auto;
                    left: 3vh;
                }
                
                .modal-overlay.small {
                    width: 330px;
                    height: 330px;
                    top: 10vh;
                    bottom: auto;
                }
            }
            @media (min-width:1024px) and (max-width:1280px){
            .modal-overlay{
            left:6rem;
            }
            }
            @media (max-width: 767px) {
                /* Mobile responsive modal */
                .modal-overlay {
                    width: 95vw;
                    height: 70vh;
                    top: 7.5vh;
                    bottom: auto;
                }
                
                .modal-overlay.small {
                    width: 400px;
                    height: 600px;
                    left: 5vw;
                    top: 7vh;
                    bottom: 0px;
                }
                
                .modal-close {
                    top: 5px;
                    right: 10px;
                    width: 25px;
                    height: 25px;
                    font-size: 16px;
                }
                
                /* Shift AR button to the right on mobile */
                .ar-button-container {
                    justify-content: flex-end;
                    margin-left: auto;
                    margin-right: 0;
                    transform: translateX(5px);
                }
                
                /* Keep buttons in same line on mobile */
                .custom-button-container {
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }
                
                .custom-button {
                    width: auto;
                    min-width: 120px;
                    padding: 12px 20px;
                    font-size: 14px;
                }
            }

            @media (min-width: 1280px) {
                .modal-overlay.small {
                    width: 518px;
                    height: 518px;
                }
            }
            
            @media (min-width: 1900px){
                .modal-overlay {
                left: 0;
                    bottom: 40rem;
                    width: 100vh;
                }
                .modal-overlay.small {
                    left: 27%;
                    bottom: 10%;
                    top: 5rem;
                    height: 518px;
                    width: 518px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create the Add To Cart button
    function createAddToCartButton() {
        const button = document.createElement('button');
        button.className = 'custom-button primary';
        button.setAttribute('type', 'button');
        button.setAttribute('aria-label', 'Add To Cart');
        
        button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            Add To Cart
        `;
        
        button.addEventListener('click', function() {
            // Add to cart functionality
            console.log('Add To Cart clicked');
            // You can add your custom add to cart logic here
            alert('Product added to cart!');
        });
        
        return button;
    }
    
    // Create the View in 3D button
    function createViewIn3DButton() {
        const button = document.createElement('button');
        button.className = 'custom-button secondary';
        button.setAttribute('type', 'button');
        button.setAttribute('aria-label', 'View in 3D');
        
        button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            View in 3D
        `;
        
        button.addEventListener('click', function() {
            // View in 3D functionality - show modal
            console.log('View in 3D clicked from main button');
            show3DModal('main');
        });
        
        return button;
    }
    
    // Create the View in AR button for the image area
    function createViewInARButton() {
        const button = document.createElement('button');
        button.className = 'ar-button';
        button.setAttribute('type', 'button');
        button.setAttribute('aria-label', 'View in 3D');
        
        button.innerHTML = `
            View in 3D
        `;
        
        button.addEventListener('click', function() {
            // View in 3D functionality - show modal
            console.log('View in 3D clicked');
            show3DModal('image');
        });
        
        return button;
    }
    
    // Function to automatically show 3D viewer by default
    function show3DViewerByDefault() {
        // Prevent multiple initializations
        if (viewer3DInitialized) {
            return;
        }
        
        const productImage = document.querySelector('.css-1xvhojq img');
        if (productImage) {
            // Get the immediate parent div of the image
            const imageParent = productImage.parentElement;
            
            // Create iframe to replace the image
            const iframe = document.createElement('iframe');
            iframe.src = "https://do3z5bfxzxgi4.cloudfront.net/product?id=83fcd4a4-ad5f-42ef-a916-f50a9221ebef";
            iframe.width = "100%";
            iframe.height = "100%";
            iframe.frameBorder = "0";
            iframe.style.border = "none";
            iframe.style.borderRadius = "8px";
            iframe.title = "3D Product Viewer";
            iframe.id = "3d-iframe";
            
            // Hide the image
            productImage.style.display = 'none';
            
            // Insert iframe in place of the image
            imageParent.appendChild(iframe);
            
            // Hide the existing AR button
            const existingARButton = document.querySelector('.css-1xvhojq .ar-button');
            if (existingARButton) {
                existingARButton.style.display = 'none';
            }
            
            // Hide our custom AR button
            const customARButton = document.querySelector('.css-1xvhojq .ar-button-container');
            if (customARButton) {
                customARButton.style.display = 'none';
            }
            
            // Add close button for the iframe
            const closeButton = document.createElement('button');
            closeButton.innerHTML = '&times;';
            closeButton.className = 'modal-close';
            closeButton.onclick = function() {
                close3DModal();
            };
            imageParent.appendChild(closeButton);
            
            // Mark as initialized to prevent multiple runs
            viewer3DInitialized = true;
            console.log('3D viewer opened by default');
        }
    }
    
    // Create and show the 3D modal
    function show3DModal(type) {
        if (type === 'image') {
            // For image area, replace the image with iframe directly
            const productImage = document.querySelector('.css-1xvhojq img');
            if (productImage) {
                // Get the immediate parent div of the image
                const imageParent = productImage.parentElement;
                
                // Create iframe to replace the image
                const iframe = document.createElement('iframe');
                iframe.src = "https://do3z5bfxzxgi4.cloudfront.net/product?id=83fcd4a4-ad5f-42ef-a916-f50a9221ebef";
                iframe.width = "100%";
                iframe.height = "100%";
                iframe.frameBorder = "0";
                iframe.style.border = "none";
                iframe.style.borderRadius = "8px";
                iframe.title = "3D Product Viewer";
                iframe.id = "3d-iframe";
                
                // Hide the image
                productImage.style.display = 'none';
                
                // Insert iframe in place of the image
                imageParent.appendChild(iframe);
                
                // Hide the existing AR button
                const existingARButton = document.querySelector('.css-1xvhojq .ar-button');
                if (existingARButton) {
                    existingARButton.style.display = 'none';
                }
                
                // Hide our custom AR button
                const customARButton = document.querySelector('.css-1xvhojq .ar-button-container');
                if (customARButton) {
                    customARButton.style.display = 'none';
                }
                
                // Add close button for the iframe
                const closeButton = document.createElement('button');
                closeButton.innerHTML = '&times;';
                closeButton.className = 'modal-close';
                closeButton.onclick = function() {
                    close3DModal();
                };
                imageParent.appendChild(closeButton);
                
            }
        } else {
            // For main button, use the existing modal approach
            let modal = document.getElementById('modal-3d');
            if (!modal) {
                modal = create3DModal();
                // Find the image container and append modal there
                const imageContainer = document.querySelector('.css-1xvhojq');
                if (imageContainer) {
                    imageContainer.appendChild(modal);
                } else {
                    document.body.appendChild(modal);
                }
            }
            
            // Show modal
            modal.classList.add('show');
            
            // Hide the product image
            const productImage = document.querySelector('.css-1xvhojq img');
            if (productImage) {
                productImage.style.display = 'none';
            }
            
            // Hide the existing AR button
            const existingARButton = document.querySelector('.css-1xvhojq .ar-button');
            if (existingARButton) {
                existingARButton.style.display = 'none';
            }
            
            // Hide our custom AR button
            const customARButton = document.querySelector('.css-1xvhojq .ar-button-container');
            if (customARButton) {
                customARButton.style.display = 'none';
            }
        }
    }
    
    // Create the 3D modal HTML
    function create3DModal() {
        const modal = document.createElement('div');
        modal.id = 'modal-3d';
        modal.className = 'modal-overlay';
        
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="close3DModal()">&times;</button>
                <iframe 
                    src="https://do3z5bfxzxgi4.cloudfront.net/product?id=83fcd4a4-ad5f-42ef-a916-f50a9221ebef"
                    width="100%" 
                    height="100%" 
                    frameborder="0"
                    style="border: none; border-radius: 8px;"
                    title="3D Product Viewer">
                </iframe>
            </div>
        `;
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                close3DModal();
            }
        });
        
        return modal;
    }
    
    // Close the 3D modal
    function close3DModal() {
        // Check if iframe is being used (image area)
        const iframe = document.getElementById('3d-iframe');
        if (iframe) {
            // Find and remove the close button first (before removing iframe)
            const imageContainer = document.querySelector('.css-1xvhojq');
            const closeButton = imageContainer.querySelector('.modal-close');
            if (closeButton) {
                closeButton.remove();
            }
            
            // Remove the iframe
            iframe.remove();
            
            // Show the product image again
            const productImage = document.querySelector('.css-1xvhojq img');
            if (productImage) {
                productImage.style.display = ''; // Restore display
            }
            
            // Show the existing AR button again
            const existingARButton = document.querySelector('.css-1xvhojq .ar-button');
            if (existingARButton) {
                existingARButton.style.display = ''; // Restore display
            }
            
            // Show our custom AR button again
            const customARButton = document.querySelector('.css-1xvhojq .ar-button-container');
            if (customARButton) {
                customARButton.style.display = ''; // Restore display
            }
            
            // Reset the initialization flag when closing
            viewer3DInitialized = false;
        } else {
            // Handle modal case
            const modal = document.getElementById('modal-3d');
            if (modal) {
                modal.classList.remove('show');
            }
            
            // Show the product image again
            const productImage = document.querySelector('.css-1xvhojq img');
            if (productImage) {
                productImage.style.display = ''; // Restore display
            }
            
            // Show the existing AR button again
            const existingARButton = document.querySelector('.css-1xvhojq .ar-button');
            if (existingARButton) {
                existingARButton.style.display = ''; // Restore display
            }
            
            // Show our custom AR button again
            const customARButton = document.querySelector('.css-1xvhojq .ar-button-container');
            if (customARButton) {
                customARButton.style.display = ''; // Restore display
            }
        }
    }
    
    // Make close3DModal globally accessible
    window.close3DModal = close3DModal;
    
    // Create the button container
    function createButtonContainer() {
        const container = document.createElement('div');
        container.className = 'custom-button-container';
        container.id = 'custom-buttons-container';
        
        const addToCartBtn = createAddToCartButton();
        const viewIn3DBtn = createViewIn3DButton();
        
        container.appendChild(viewIn3DBtn);
        container.appendChild(addToCartBtn);
        
        return container;
    }
    
    // Add AR button to the image area
    function addARButtonToImageArea() {
        const imageContainer = document.querySelector('.css-1xvhojq');
        if (imageContainer) {
            // Check if AR button is already added
            if (imageContainer.querySelector('.ar-button-container')) {
                return;
            }
            
            // Create AR button container
            const arButtonContainer = document.createElement('div');
            arButtonContainer.className = 'ar-button-container';
            
            // Create the AR button
            const arButton = createViewInARButton();
            arButtonContainer.appendChild(arButton);
            
            // Insert after the existing AR button or at the end of the container
            const existingARButton = imageContainer.querySelector('.ar-button');
            if (existingARButton) {
                existingARButton.parentNode.insertBefore(arButtonContainer, existingARButton.nextSibling);
            } else {
                imageContainer.appendChild(arButtonContainer);
            }
            
            console.log('AR button added to image area successfully!');
        }
    }
    
    // Find the css-18m6ozg container and insert buttons below it
    function findInsertionPoint() {
        // Look for the css-18m6ozg container
        const targetContainer = document.querySelector('.css-18m6ozg');
        if (targetContainer) {
            return targetContainer;
        }
        
        // Fallback: look for common product page containers
        const selectors = [
            '[data-testid="product-details"]',
            '.product-details',
            '.product-info'
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) return element;
        }
        
        return null;
    }
    
    // Clean up any existing custom buttons
    function cleanupExistingButtons() {
        const existingContainers = document.querySelectorAll('.custom-button-container, #custom-buttons-container');
        existingContainers.forEach(container => {
            if (container && container.parentNode) {
                container.parentNode.removeChild(container);
            }
        });
        
        // Clean up AR buttons
        const existingARContainers = document.querySelectorAll('.ar-button-container');
        existingARContainers.forEach(container => {
            if (container && container.parentNode) {
                container.parentNode.removeChild(container);
            }
        });
    }
    
    // Main function to initialize the buttons
    function initializeButtons() {
        // Prevent multiple initializations
        if (buttonsInitialized) {
            return;
        }
        
        // Clean up any existing buttons first
        cleanupExistingButtons();
        
        const targetContainer = findInsertionPoint();
        
        if (targetContainer) {
            const buttonContainer = createButtonContainer();
            
            // Insert the buttons after the target container (below it)
            targetContainer.parentNode.insertBefore(buttonContainer, targetContainer.nextSibling);
            
            // Add AR button to image area
            addARButtonToImageArea();
            
            buttonsInitialized = true;
            console.log('Custom buttons added successfully below css-18m6ozg!');
            
            // Stop observing once buttons are added
            if (observer) {
                observer.disconnect();
                observer = null;
            }
        } else {
            console.log('Could not find suitable location for custom buttons');
        }
    }
    
    // Function to initialize 3D viewer by default
    function initialize3DViewer() {
        // Prevent multiple initializations
        if (viewer3DInitialized) {
            return;
        }
        
        // Wait for the image container to be available
        const imageContainer = document.querySelector('.css-1xvhojq');
        if (imageContainer && imageContainer.querySelector('img')) {
            // Show 3D viewer by default
            show3DViewerByDefault();
        } else {
            // If not ready yet, try again after a short delay
            setTimeout(initialize3DViewer, 500);
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            injectCustomStyles();
            // Wait a bit for dynamic content to load
            setTimeout(initializeButtons, 1000);
            // Initialize 3D viewer by default (only once)
            setTimeout(initialize3DViewer, 1500);
        });
    } else {
        injectCustomStyles();
        // DOM is already ready, wait for dynamic content
        setTimeout(initializeButtons, 1000);
        // Initialize 3D viewer by default (only once)
        setTimeout(initialize3DViewer, 1500);
    }
    
    // Also try to initialize after a longer delay in case of very slow loading (only once)
    setTimeout(initializeButtons, 3000);
    
    // Listen for dynamic content changes
    observer = new MutationObserver(function(mutations) {
        // Only proceed if buttons haven't been initialized yet
        if (buttonsInitialized) {
            return;
        }
        
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check if our buttons are already added
                if (!document.querySelector('.custom-button-container') && !buttonsInitialized) {
                    setTimeout(initializeButtons, 500);
                }
                
                // Check if we can initialize 3D viewer (only if not already initialized)
                if (!document.getElementById('3d-iframe') && !viewer3DInitialized) {
                    setTimeout(initialize3DViewer, 500);
                }
            }
        });
    });
    
    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
})();
