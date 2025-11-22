// Spacecraft.js
// Player spacecraft class for navigation and interaction in the solar system
// Extensible for future features (fuel, docking, missions, etc.)

import * as THREE from '../../libs/three.module.js';

export class Spacecraft {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.acceleration = new THREE.Vector3(0, 0, 0);
        this.orientation = new THREE.Euler(0, 0, 0, 'YXZ');
        this.speed = 0;
        this.maxSpeed = 100;
        this.mesh = this.createMesh();
        this.scene.add(this.mesh);
        this.attachCamera();
    }

    createMesh() {
        // Simple placeholder: a cone for the spacecraft
        const geometry = new THREE.ConeGeometry(2, 6, 16);
        const material = new THREE.MeshStandardMaterial({ color: 0x00ffcc });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, 30); // Start away from the sun
        mesh.rotation.x = Math.PI / 2;
        return mesh;
    }

    attachCamera() {
        // Position camera behind the spacecraft
        this.camera.position.copy(this.mesh.position).add(new THREE.Vector3(0, 10, 30));
        this.camera.lookAt(this.mesh.position);
    }

    update(deltaTime, controlsInput) {
        // controlsInput: { thrust, yaw, pitch, roll }
        // Apply rotation
        if (controlsInput) {
            this.orientation.y += controlsInput.yaw * deltaTime;
            this.orientation.x += controlsInput.pitch * deltaTime;
            this.orientation.z += controlsInput.roll * deltaTime;
            this.mesh.rotation.copy(this.orientation);
            // Apply thrust
            if (controlsInput.thrust !== 0) {
                const forward = new THREE.Vector3(0, 0, -1).applyEuler(this.orientation);
                this.velocity.add(forward.multiplyScalar(controlsInput.thrust * deltaTime * 10));
            }
        }
        // Limit speed
        if (this.velocity.length() > this.maxSpeed) {
            this.velocity.setLength(this.maxSpeed);
        }
        // Update position
        this.mesh.position.add(this.velocity.clone().multiplyScalar(deltaTime));
        // Move camera with spacecraft
        this.attachCamera();
    }

    getPosition() {
        return this.mesh.position.clone();
    }

    getSpeed() {
        return this.velocity.length();
    }
}
