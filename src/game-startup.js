// Game startup script
console.log('Game startup script loaded');

// Function to verify THREE extensions
window.debugTHREE = function() {
    const debugEl = document.getElementById('loading-debug');
    if (!debugEl) return;

    debugEl.innerHTML += 'Verifying THREE extensions...<br>';

    // Check important THREE extensions
    const checks = {
        'THREE': typeof THREE !== 'undefined',
        'DRACOLoader': typeof THREE.DRACOLoader !== 'undefined',
        'GLTFLoader': typeof THREE.GLTFLoader !== 'undefined',
        'OrbitControls': typeof OrbitControls !== 'undefined'
    };

    // Log results
    for (const [name, exists] of Object.entries(checks)) {
        debugEl.innerHTML += `${name}: ${exists ? 'available' : 'MISSING'}<br>`;
        console.log(`${name}: ${exists ? 'available' : 'MISSING'}`);
    }
};

// Initialize module debug log
console.log('Verifying THREE extensions...');
if (typeof THREE === 'undefined') {
    console.error('THREE.js is not loaded!');
} else {
    console.log('THREE.js is loaded successfully.');
}

if (typeof THREE.DRACOLoader !== 'undefined') {
    console.log('DRACOLoader already available');
} else {
    console.warn('DRACOLoader not available');
}

if (typeof THREE.GLTFLoader !== 'undefined') {
    console.log('GLTFLoader already available');
} else {
    console.warn('GLTFLoader not available');
}

if (typeof OrbitControls !== 'undefined') {
    console.log('OrbitControls already available');
} else {
    console.warn('OrbitControls not available');
}

// Wait for DOM to be fully loaded - SINGLE INITIALIZATION POINT
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing game...');

    // Check if THREE is loaded
    if (typeof THREE === 'undefined') {
        console.error('THREE.js is not loaded');
        document.getElementById('loading-debug').innerHTML = 'THREE.js not loaded. Please check your internet connection or try a different browser.';
        return;
    }
    
    console.log('THREE loaded successfully');
    console.log('Starting game initialization...');
    
    try {
        // Initialize game
        game.init()
            .then(success => {
                if (success) {
                    console.log('Game initialization complete.');
                    game.start();
                } else {
                    console.error('Game initialization failed.');
                }
            })
            .catch(error => {
                console.error('Game initialization error:', error);
                document.querySelector('#loading-debug').innerHTML += `Game initialization error: ${error.message}<br>`;
                
                // Show detailed error for debugging
                const errorDetails = document.createElement('div');
                errorDetails.style.color = 'red';
                errorDetails.style.marginTop = '10px';
                errorDetails.innerHTML = `
                    <strong>Error Details:</strong><br>
                    Message: ${error.message}<br>
                    Stack: ${error.stack || 'No stack trace available'}<br>
                `;
                document.getElementById('loading-debug').appendChild(errorDetails);
            });
    } catch (error) {
        console.error('Error starting game:', error);
        document.getElementById('loading-debug').innerHTML += `Error starting game: ${error.message}<br>`;
    }
}); 