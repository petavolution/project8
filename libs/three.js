// This is a non-module version of THREE.js
// All exports are assigned to the global THREE object

// Create the THREE namespace
window.THREE = window.THREE || {};

// Include the CDN version of three.js which assigns to the window.THREE object
document.write('<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\/script>');

console.log('Added THREE from CDN to global scope'); 