/**
 * main.js
 * Entry point for the space simulation game
 */

// Ensure Three.js is loaded before continuing
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game...');
    
    // Add error tracking for uncaught errors
    window.addEventListener('error', function(event) {
        console.error('Global error:', event.error);
        const errorMessage = event.error ? event.error.toString() : event.message;
        showErrorScreen(`Uncaught error: ${errorMessage}`);
        return false;
    });
    
    // Initialize the game
    initializeGame();
});

/**
 * Initialize the game and handle loading
 */
async function initializeGame() {
    try {
        // Show loading screen (should already be visible from HTML)
        updateLoadingProgress(5, 'Loading Three.js...');
        
        // Initialize debug display
        updateDebugText('Initializing game...');
        
        // Load Three.js library and extensions using our ThreeLoader
        updateDebugText('Creating Three.js objects...');
        const threeLoaded = await ThreeLoader.init();
        if (!threeLoaded) {
            updateDebugText('Warning: Three.js had issues initializing, attempting to continue');
        }
        updateLoadingProgress(15, 'Creating game engine...');
        
        // Create the engine instance
        updateDebugText('Creating Engine...');
        window.engine = new Engine();
        
        // Initialize the engine
        updateLoadingProgress(20, 'Initializing engine...');
        updateDebugText('Initializing Engine...');
        const success = await window.engine.init();
        
        if (success) {
            // Start the game loop
            updateDebugText('Starting game loop...');
            window.engine.start();
            updateLoadingProgress(100, 'Game loaded!');
            
            // Hide loading screen after a short delay
            setTimeout(() => {
                hideLoadingScreen();
            }, 500);
            
            console.log('Game started successfully');
        } else {
            throw new Error('Engine initialization failed');
        }
    } catch (error) {
        console.error('Error initializing game:', error);
        updateDebugText(`Error: ${error.message}`);
        showErrorScreen(`Failed to initialize game: ${error.message}`);
    }
}

/**
 * Update debug text display
 * @param {string} message - Message to display
 */
function updateDebugText(message) {
    console.log(`DEBUG: ${message}`);
    const debugElement = document.getElementById('debug-text');
    if (debugElement) {
        debugElement.textContent = message;
    }
}

/**
 * Show loading screen
 */
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
    }
}

/**
 * Update loading progress
 * @param {number} percent - Loading progress percentage (0-100)
 * @param {string} message - Loading message to display
 */
function updateLoadingProgress(percent, message) {
    const loadingBar = document.getElementById('loading-bar');
    const loadingMessage = document.getElementById('loading-message');
    
    if (loadingBar) {
        loadingBar.style.width = `${percent}%`;
    }
    
    if (loadingMessage && message) {
        loadingMessage.textContent = message;
    }
    
    console.log(`Loading: ${percent}% - ${message}`);
}

/**
 * Hide loading screen
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 1s ease-in-out';
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 1000);
    }
}

/**
 * Show error screen
 * @param {string} message - Error message to display
 */
function showErrorScreen(message) {
    const errorScreen = document.getElementById('error-screen');
    const errorMessage = document.getElementById('error-message');
    
    if (errorScreen && errorMessage) {
        errorMessage.textContent = message;
        errorScreen.style.display = 'flex';
    } else {
        console.error('Error screen elements not found, displaying alert instead');
        alert(`Error: ${message}`);
    }
}

/**
 * Show coordinates display
 * @param {Object} position - Position object with x, y, and z properties
 */
function showCoordinates(position) {
    if (!position) return;
    
    const debugElement = document.getElementById('debug-text');
    if (debugElement) {
        debugElement.textContent = `Position: X: ${position.x.toFixed(2)}, Y: ${position.y.toFixed(2)}, Z: ${position.z.toFixed(2)}`;
    }
}

/**
 * Show camera mode
 * @param {string} mode - Camera mode to display
 */
function showCameraMode(mode) {
    const debugElement = document.getElementById('debug-text');
    if (debugElement) {
        debugElement.textContent = `Camera Mode: ${mode}`;
    }
}

/**
 * Show message to user
 * @param {string} text - Message text
 * @param {string} type - Message type (info, warning, error)
 */
function showMessage(text, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${text}`);
    
    // Display in debug text
    const debugElement = document.getElementById('debug-text');
    if (debugElement) {
        debugElement.textContent = text;
        
        // Set color based on message type
        switch (type) {
            case 'error':
                debugElement.style.color = '#f44336';
                break;
            case 'warning':
                debugElement.style.color = '#ff9800';
                break;
            case 'success':
                debugElement.style.color = '#4CAF50';
                break;
            default:
                debugElement.style.color = '#4CAF50';
        }
        
        // Auto-hide after a few seconds for non-error messages
        if (type !== 'error') {
            setTimeout(() => {
                debugElement.textContent = '';
            }, 3000);
        }
    }
}

// Make helper functions globally available
window.showCoordinates = showCoordinates;
window.showCameraMode = showCameraMode;
window.showMessage = showMessage;
window.updateDebugText = updateDebugText; 