// This is a non-module version of THREE.js
// All exports are assigned to the global THREE object

// Create the THREE namespace
window.THREE = window.THREE || {};

// Load THREE.js from CDN (more reliable than trying to load ES module locally)
document.write('<script src="https://cdn.jsdelivr.net/npm/three@0.174.0/build/three.min.js"><\/script>');

console.log('Loading THREE.js from CDN version 0.174.0...'); 