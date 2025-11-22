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
    
    // Track which extensions we've set up
    const extensions = {
        'DRACOLoader': false,
        'GLTFLoader': false,
        'OrbitControls': false
    };
    
    // Add event listener to ensure extensions are exported after they load
    document.addEventListener('extensionLoaded', function(e) {
        const extensionName = e.detail.name;
        if (extensions.hasOwnProperty(extensionName) && window[extensionName]) {
            console.log(`Exporting ${extensionName} to THREE namespace`);
            THREE[extensionName] = window[extensionName];
            extensions[extensionName] = true;
        }
    });
    
    // Set up a watcher for when the page is loaded
    window.addEventListener('load', function() {
        console.log('Checking for THREE extensions on page load...');
        
        // Check for DRACOLoader
        if (typeof window.DRACOLoader !== 'undefined' && typeof THREE.DRACOLoader === 'undefined') {
            console.log('Exporting DRACOLoader to THREE namespace');
            THREE.DRACOLoader = window.DRACOLoader;
            extensions.DRACOLoader = true;
        }
        
        // Check for GLTFLoader
        if (typeof window.GLTFLoader !== 'undefined' && typeof THREE.GLTFLoader === 'undefined') {
            console.log('Exporting GLTFLoader to THREE namespace');
            THREE.GLTFLoader = window.GLTFLoader;
            extensions.GLTFLoader = true;
        }
        
        // Check for OrbitControls
        if (typeof window.OrbitControls !== 'undefined' && typeof THREE.OrbitControls === 'undefined') {
            console.log('Exporting OrbitControls to THREE namespace');
            THREE.OrbitControls = window.OrbitControls;
            extensions.OrbitControls = true;
        }
        
        // Log final status
        console.log('THREE extensions export status:', extensions);
    });
    
    // Also check immediately
    setTimeout(function() {
        // Check for DRACOLoader
        if (typeof window.DRACOLoader !== 'undefined' && typeof THREE.DRACOLoader === 'undefined') {
            console.log('Exporting DRACOLoader to THREE namespace (immediate)');
            THREE.DRACOLoader = window.DRACOLoader;
            extensions.DRACOLoader = true;
        }
        
        // Check for GLTFLoader
        if (typeof window.GLTFLoader !== 'undefined' && typeof THREE.GLTFLoader === 'undefined') {
            console.log('Exporting GLTFLoader to THREE namespace (immediate)');
            THREE.GLTFLoader = window.GLTFLoader;
            extensions.GLTFLoader = true;
        }
        
        // Check for OrbitControls
        if (typeof window.OrbitControls !== 'undefined' && typeof THREE.OrbitControls === 'undefined') {
            console.log('Exporting OrbitControls to THREE namespace (immediate)');
            THREE.OrbitControls = window.OrbitControls;
            extensions.OrbitControls = true;
        }
    }, 100);
}

// Set up MutationObserver to monitor when scripts are loaded
function monitorScriptLoading() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.tagName === 'SCRIPT' && node.src) {
                        const src = node.src.toLowerCase();
                        
                        // Watch for specific extension scripts
                        node.addEventListener('load', function() {
                            if (src.includes('dracoloader')) {
                                console.log('DRACOLoader script loaded');
                                document.dispatchEvent(new CustomEvent('extensionLoaded', { detail: { name: 'DRACOLoader' } }));
                            } else if (src.includes('gltfloader')) {
                                console.log('GLTFLoader script loaded');
                                document.dispatchEvent(new CustomEvent('extensionLoaded', { detail: { name: 'GLTFLoader' } }));
                            } else if (src.includes('orbitcontrols')) {
                                console.log('OrbitControls script loaded');
                                document.dispatchEvent(new CustomEvent('extensionLoaded', { detail: { name: 'OrbitControls' } }));
                            }
                        });
                    }
                });
            }
        });
    });
    
    observer.observe(document.documentElement, { childList: true, subtree: true });
}

// Run our extension exporter
ensureThreeExtensions();
monitorScriptLoading();

console.log('THREE-export.js initialized'); 