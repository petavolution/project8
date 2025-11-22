// SceneManager.js
// Core module for setting up and managing the Three.js scene, camera, renderer, and lighting
import * as THREE from '../../libs/three.module.js';

export class SceneManager {
    constructor(containerId) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.set(0, 50, 200);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById(containerId).appendChild(this.renderer.domElement);
        this.addLights();
    }

    addLights() {
        const ambient = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambient);
        const sun = new THREE.PointLight(0xffffff, 1.5, 0, 2);
        sun.position.set(0, 0, 0);
        this.scene.add(sun);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}
