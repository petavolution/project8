// Modular entrypoint for the game, integrating NASA-inspired modules
import CONFIG from '../modules/config/config.js';
import { preloadAssetsFromManifest } from '../modules/preload/preload.js';
import { setupControls } from '../modules/controls/controls.js';
import { SceneManager } from '../modules/simulation/SceneManager.js';
import { SolarSystem } from '../modules/simulation/SolarSystem.js';
import { CELESTIAL_CONFIG } from '../modules/simulation/celestial_config.js';
import { Spacecraft } from '../modules/simulation/Spacecraft.js';

// NASA-inspired: Import core libraries from local libs/
import * as THREE from '../libs/three.module.js';
// import { DRACOLoader } from '../libs/draco/DRACOLoader.js';

// Path to manifest file
const manifestUrl = '../assets/asset_manifest.json';

// Preload assets from manifest before starting game logic
preloadAssetsFromManifest(manifestUrl, (progress) => {
    console.log(`Loading: ${Math.round(progress * 100)}%`);
}, () => {
    console.log('All assets loaded. Starting game...');
    // Create scene manager
    const sceneManager = new SceneManager('game-container');
    // Create solar system with celestial config
    const solarSystem = new SolarSystem(sceneManager.scene, CELESTIAL_CONFIG);

    // Create player spacecraft and attach camera
    const spacecraft = new Spacecraft(sceneManager.scene, sceneManager.camera);

    // Set up controls with camera and renderer
    setupControls(sceneManager.camera, sceneManager.renderer);

    // --- Simple keyboard input for spacecraft ---
    const keys = {};
    window.addEventListener('keydown', e => { keys[e.code] = true; });
    window.addEventListener('keyup', e => { keys[e.code] = false; });
    function getControlsInput() {
        // WASD/Arrow keys for rotation, thrust with W/ArrowUp
        return {
            thrust: (keys['KeyW'] || keys['ArrowUp']) ? 1 : ((keys['KeyS'] || keys['ArrowDown']) ? -1 : 0),
            yaw: (keys['KeyA'] || keys['ArrowLeft']) ? 1 : ((keys['KeyD'] || keys['ArrowRight']) ? -1 : 0),
            pitch: (keys['KeyQ']) ? 1 : ((keys['KeyE']) ? -1 : 0),
            roll: (keys['KeyZ']) ? 1 : ((keys['KeyC']) ? -1 : 0)
        };
    }

    // Animation loop
    let lastTime = performance.now();
    function animate() {
        requestAnimationFrame(animate);
        const now = performance.now();
        const delta = (now - lastTime) / 1000;
        lastTime = now;
        solarSystem.update(delta);
        spacecraft.update(delta, getControlsInput());
        // HUD update
        const speedElem = document.getElementById('speed-value');
        const xElem = document.getElementById('x-coord');
        const yElem = document.getElementById('y-coord');
        const zElem = document.getElementById('z-coord');
        if (speedElem && xElem && yElem && zElem) {
            speedElem.textContent = spacecraft.getSpeed().toFixed(2);
            const pos = spacecraft.getPosition();
            xElem.textContent = pos.x.toFixed(2);
            yElem.textContent = pos.y.toFixed(2);
            zElem.textContent = pos.z.toFixed(2);
        }
        sceneManager.render();
    }
    animate();
    // Ensure there is a div#game-container in index.html for the renderer DOM element.
});

// Documentation: This file demonstrates how to integrate NASA-inspired asset management, manifest-based preloading, configuration, and controls.
// Port additional game logic here as you migrate from legacy scripts.
