// Game startup script
console.log('Game startup script loaded');

// Function to verify THREE extensions
window.debugTHREE = function() {
    const debugEl = document.getElementById('loading-debug');
    if (!debugEl) return;

    debugEl.innerHTML += 'Verifying THREE extensions...<br>';

    // Check important THREE extensions - check for global constructors
    const checks = {
        'THREE': typeof THREE !== 'undefined',
        'DRACOLoader': typeof THREE.DRACOLoader !== 'undefined',
        'GLTFLoader': typeof THREE.GLTFLoader !== 'undefined',
        'OrbitControls': typeof THREE.OrbitControls !== 'undefined'
    };

    // Update UI elements
    const threeStatus = document.querySelector('#three-status span');
    const dracoStatus = document.querySelector('#draco-status span');
    const gltfStatus = document.querySelector('#gltf-status span');
    const orbitStatus = document.querySelector('#orbit-status span');
    
    if (threeStatus) threeStatus.innerHTML = checks.THREE ? '<span style="color: #4CAF50;">Loaded ✓</span>' : '<span style="color: #F44336;">Missing ✗</span>';
    if (dracoStatus) dracoStatus.innerHTML = checks.DRACOLoader ? '<span style="color: #4CAF50;">Loaded ✓</span>' : '<span style="color: #F44336;">Missing ✗</span>';
    if (gltfStatus) gltfStatus.innerHTML = checks.GLTFLoader ? '<span style="color: #4CAF50;">Loaded ✓</span>' : '<span style="color: #F44336;">Missing ✗</span>';
    if (orbitStatus) orbitStatus.innerHTML = checks.OrbitControls ? '<span style="color: #4CAF50;">Loaded ✓</span>' : '<span style="color: #F44336;">Missing ✗</span>';

    // Log results
    for (const [name, exists] of Object.entries(checks)) {
        debugEl.innerHTML += `${name}: ${exists ? 'available' : 'MISSING'}<br>`;
        console.log(`${name}: ${exists ? 'available' : 'MISSING'}`);
    }
    
    // If libraries are missing, suggest fixes
    const missingLibs = Object.entries(checks).filter(([_, exists]) => !exists).map(([name]) => name);
    if (missingLibs.length > 0) {
        debugEl.innerHTML += `<br><strong>Missing libraries:</strong> ${missingLibs.join(', ')}<br>`;
        debugEl.innerHTML += 'Possible fixes:<br>';
        debugEl.innerHTML += '1. Check if all script files are properly loaded<br>';
        debugEl.innerHTML += '2. Check for any JavaScript errors in the console<br>';
        debugEl.innerHTML += '3. Try refreshing the page<br>';
        debugEl.innerHTML += '4. Check internet connection (needed for CDN resources)<br>';
    }
};

// Function to update library status
function updateLibraryStatus() {
    const threeStatus = document.querySelector('#three-status span');
    const dracoStatus = document.querySelector('#draco-status span');
    const gltfStatus = document.querySelector('#gltf-status span');
    const orbitStatus = document.querySelector('#orbit-status span');
    
    if (threeStatus) threeStatus.innerHTML = typeof THREE !== 'undefined' ? 
        '<span style="color: #4CAF50;">Loaded ✓</span>' : 
        '<span style="color: #F44336;">Missing ✗</span>';
    
    if (dracoStatus) dracoStatus.innerHTML = typeof THREE !== 'undefined' && typeof THREE.DRACOLoader !== 'undefined' ? 
        '<span style="color: #4CAF50;">Loaded ✓</span>' : 
        '<span style="color: #F44336;">Missing ✗</span>';
    
    if (gltfStatus) gltfStatus.innerHTML = typeof THREE !== 'undefined' && typeof THREE.GLTFLoader !== 'undefined' ? 
        '<span style="color: #4CAF50;">Loaded ✓</span>' : 
        '<span style="color: #F44336;">Missing ✗</span>';
        
    if (orbitStatus) orbitStatus.innerHTML = typeof THREE !== 'undefined' && typeof THREE.OrbitControls !== 'undefined' ? 
        '<span style="color: #4CAF50;">Loaded ✓</span>' : 
        '<span style="color: #F44336;">Missing ✗</span>';
}

// Initialize module debug log
console.log('Verifying THREE extensions...');
if (typeof THREE === 'undefined') {
    console.error('THREE.js is not loaded!');
} else {
    console.log('THREE.js is loaded successfully.');
}

// Check library status after a short delay to allow scripts to load
setTimeout(updateLibraryStatus, 1000);
// And check again after a longer delay
setTimeout(updateLibraryStatus, 3000);

// Wait for DOM to be fully loaded - SINGLE INITIALIZATION POINT
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing game...');

    // Check if THREE is loaded
    if (typeof THREE === 'undefined') {
        console.error('THREE.js is not loaded');
        const loadingDebug = document.getElementById('loading-debug');
        if (loadingDebug) {
            loadingDebug.innerHTML = 'THREE.js not loaded. Please check your internet connection or try a different browser.';
        }
        return;
    }
    
    console.log('THREE loaded successfully');
    
    // Update library status
    updateLibraryStatus();
    
    // Game initialization is now handled by the script in index.html
    // This ensures proper sequencing of module initialization
    console.log('Game initialization will be handled in sequence');
}); 