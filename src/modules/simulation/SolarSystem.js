// SolarSystem.js
// Core simulation module for managing celestial bodies and their orbits
// Extensible, config-driven, and designed for realistic simulation

import * as THREE from '../../libs/three.module.js';
import CONFIG from '../config/config.js';

export class SolarSystem {
    constructor(scene, celestialConfig) {
        this.scene = scene;
        this.bodies = [];
        this.moons = [];
        this.time = 0;
        this.sun = null;
        this.initBodies(celestialConfig);
    }

    initBodies(config) {
        // Render the sun at the origin
        if (config.sun) {
            const sunGeometry = new THREE.SphereGeometry(config.sun.radius, 48, 48);
            const sunMaterial = new THREE.MeshStandardMaterial({ map: config.sun.texture, emissive: 0xffff99, emissiveIntensity: 0.8 });
            this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
            this.sun.position.set(0, 0, 0);
            this.scene.add(this.sun);
        }
        // Render planets and their moons
        config.planets.forEach(planet => {
            const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
            const material = new THREE.MeshStandardMaterial({ map: planet.texture });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(planet.orbitRadius, 0, 0);
            mesh.userData = planet;
            this.scene.add(mesh);
            this.bodies.push({mesh, ...planet});

            // Render moons if present
            if (planet.moons) {
                planet.moons.forEach(moon => {
                    const moonGeometry = new THREE.SphereGeometry(moon.radius, 24, 24);
                    const moonMaterial = new THREE.MeshStandardMaterial({ map: moon.texture });
                    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
                    // Initial moon position relative to planet
                    moonMesh.position.set(
                        mesh.position.x + moon.orbitRadius,
                        0,
                        mesh.position.z
                    );
                    moonMesh.userData = moon;
                    this.scene.add(moonMesh);
                    this.moons.push({mesh: moonMesh, planetMesh: mesh, ...moon});
                });
            }
        });
    }

    update(deltaTime) {
        this.time += deltaTime;
        // Update planets
        this.bodies.forEach(body => {
            const angle = (this.time / body.orbitPeriod) * 2 * Math.PI;
            body.mesh.position.x = Math.cos(angle) * body.orbitRadius;
            body.mesh.position.z = Math.sin(angle) * body.orbitRadius;
        });
        // Update moons
        this.moons.forEach(moonObj => {
            const planetAngle = (this.time / moonObj.orbitPeriod) * 2 * Math.PI;
            // Orbit around parent planet
            const planetPos = moonObj.planetMesh.position;
            moonObj.mesh.position.x = planetPos.x + Math.cos(planetAngle) * moonObj.orbitRadius;
            moonObj.mesh.position.z = planetPos.z + Math.sin(planetAngle) * moonObj.orbitRadius;
        });
    }
}
