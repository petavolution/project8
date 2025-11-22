// Debug script to help diagnose THREE.js loading issues
console.log('Debug script running');

// Check if THREE is available and what properties it has
function debugTHREE() {
    console.log('---------- THREE.js DEBUG INFO ----------');
    console.log('THREE global check:', typeof window.THREE);
    
    if (typeof window.THREE === 'object') {
        // Check for essential THREE classes
        const components = [
            'Scene', 'PerspectiveCamera', 'WebGLRenderer', 'Mesh',
            'BoxGeometry', 'MeshBasicMaterial', 'Vector3', 'Color'
        ];
        
        console.log('THREE components check:');
        components.forEach(component => {
            console.log(`- ${component}: ${typeof window.THREE[component] === 'function' ? 'Available ✓' : 'MISSING ✗'}`);
        });
        
        // Check for extension classes
        const extensions = [
            'OrbitControls', 'GLTFLoader', 'DRACOLoader'
        ];
        
        console.log('THREE extensions check:');
        extensions.forEach(ext => {
            console.log(`- ${ext}: ${typeof window[ext] === 'function' ? 'Available ✓' : 'MISSING ✗'}`);
        });
    }
    
    // Check script elements on page
    const scripts = document.querySelectorAll('script');
    console.log('Loaded scripts:');
    scripts.forEach((script, index) => {
        console.log(`- [${index}] ${script.src || '[inline script]'}`);
    });
    
    console.log('---------------------------------------');
}

// Run debug after a short delay to allow other scripts to load
setTimeout(debugTHREE, 500);

// Export function for manual debugging
window.debugTHREE = debugTHREE; 