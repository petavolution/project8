// Utility functions for Planetary World Simulation

/**
 * Updates loading progress bar and text
 * @param {number} percent - Loading progress percentage (0-100)
 * @param {string} message - Loading status message
 */
function updateLoadingProgress(percent, message) {
    const loadingBar = document.getElementById('loading-bar');
    const loadingText = document.getElementById('loading-text');
    
    if (loadingBar) {
        loadingBar.style.width = `${percent}%`;
    }
    
    if (loadingText && message) {
        loadingText.textContent = message;
    }
}

/**
 * Shows the loading screen
 */
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.remove('hidden');
        loadingScreen.style.opacity = '1';
        loadingScreen.style.display = 'flex';
    }
}

/**
 * Hides the loading screen
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 1s ease-in-out';
        
        // Hide completely after transition
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            loadingScreen.classList.add('hidden');
        }, 1000);
    }
}

/**
 * Shows the welcome screen
 */
function showWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    if (welcomeScreen) {
        welcomeScreen.classList.remove('hidden');
    }
}

/**
 * Hides the welcome screen
 */
function hideWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    if (welcomeScreen) {
        welcomeScreen.classList.add('hidden');
    }
}

/**
 * Shows coordinates display
 */
function showCoordinates() {
    const coordinates = document.getElementById('coordinates');
    if (coordinates) {
        coordinates.style.display = 'block';
    }
}

/**
 * Updates coordinates display
 * @param {THREE.Vector3} position - Position vector
 */
function updateCoordinates(position) {
    const coordinates = document.getElementById('coordinates');
    if (coordinates) {
        coordinates.textContent = `X: ${position.x.toFixed(2)} Y: ${position.y.toFixed(2)} Z: ${position.z.toFixed(2)}`;
    }
}

/**
 * Calculates distance between two Vector3 objects
 * @param {THREE.Vector3} v1 - First vector
 * @param {THREE.Vector3} v2 - Second vector
 * @returns {number} Distance between vectors
 */
function calculateDistance(v1, v2) {
    return Math.sqrt(
        Math.pow(v2.x - v1.x, 2) +
        Math.pow(v2.y - v1.y, 2) +
        Math.pow(v2.z - v1.z, 2)
    );
}

/**
 * Shows a distance indicator with the given text
 * @param {string} text - Text to display
 * @param {boolean} isUrgent - Whether to use urgent animation
 */
function showDistanceIndicator(text, isUrgent = false) {
    let indicator = document.getElementById('distance-indicator');
    
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'distance-indicator';
        indicator.className = 'distance-indicator';
        document.body.appendChild(indicator);
    }
    
    indicator.textContent = text;
    indicator.style.display = 'block';
    
    // Remove previous animation classes
    indicator.classList.remove('distance-indicator-pulse', 'distance-indicator-urgent');
    
    // Add appropriate animation class
    if (isUrgent) {
        indicator.classList.add('distance-indicator-urgent');
    } else {
        indicator.classList.add('distance-indicator-pulse');
    }
}

/**
 * Hides the distance indicator
 */
function hideDistanceIndicator() {
    const indicator = document.getElementById('distance-indicator');
    if (indicator) {
        indicator.style.display = 'none';
    }
}

/**
 * Creates a planet label element
 * @param {string} name - Planet name
 * @returns {HTMLElement} Label element
 */
function createPlanetLabel(name) {
    const label = document.createElement('div');
    label.className = 'planet-label';
    label.textContent = name;
    label.style.display = 'none';
    document.body.appendChild(label);
    return label;
}

/**
 * Updates the position of a label to follow a 3D object
 * @param {HTMLElement} labelElement - The DOM element for the label
 * @param {THREE.Object3D} object - The 3D object to track
 * @param {THREE.Camera} camera - The camera
 * @param {THREE.WebGLRenderer} renderer - The renderer
 */
function updateLabelPosition(labelElement, object, camera, renderer) {
    if (!labelElement || !object) return;
    
    // Get screen position
    const vector = new THREE.Vector3();
    object.getWorldPosition(vector);
    vector.project(camera);
    
    // Convert to screen coordinates
    const x = (vector.x * 0.5 + 0.5) * renderer.domElement.width;
    const y = (-vector.y * 0.5 + 0.5) * renderer.domElement.height;
    
    // Update label position
    labelElement.style.left = `${x}px`;
    labelElement.style.top = `${y}px`;
    
    // Show label if object is in front of camera
    if (vector.z < 1) {
        labelElement.style.display = 'block';
    } else {
        labelElement.style.display = 'none';
    }
} 