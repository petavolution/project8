// THREE-export.js
// Helper script to ensure THREE extensions are properly exported to the THREE namespace

console.log('THREE-export.js loaded');

// Function to ensure THREE is available
function ensureThreeExtensions() {
    // Check if THREE is loaded
    if (typeof THREE === 'undefined') {
        console.error('THREE.js is not loaded, cannot export extensions');
        return;
    }

    console.log('Exporting THREE extensions to global THREE namespace...');
    
    // Add event listeners for when extensions load
    window.addEventListener('load', function() {
        setTimeout(function() {
            console.log('Checking for OrbitControls in global scope...');
            if (typeof OrbitControls !== 'undefined' && !THREE.OrbitControls) {
                console.log('Exporting OrbitControls to THREE namespace');
                THREE.OrbitControls = OrbitControls;
            }
            
            console.log('Checking for DRACOLoader in global scope...');
            if (typeof DRACOLoader !== 'undefined' && !THREE.DRACOLoader) {
                console.log('Exporting DRACOLoader to THREE namespace');
                THREE.DRACOLoader = DRACOLoader;
            }
            
            console.log('Checking for GLTFLoader in global scope...');
            if (typeof GLTFLoader !== 'undefined' && !THREE.GLTFLoader) {
                console.log('Exporting GLTFLoader to THREE namespace');
                THREE.GLTFLoader = GLTFLoader;
            }
            
            console.log('THREE extension export status updated');
        }, 500);
    });
}

// Run our extension exporter
ensureThreeExtensions();

console.log('THREE-export.js initialized'); 