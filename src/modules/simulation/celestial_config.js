// celestial_config.js
// Example config structure for celestial bodies in the solar system
// Extendable for more planets, moons, and properties

import * as THREE from '../../libs/three.module.js';

export const CELESTIAL_CONFIG = {
    // All distances in millions of km (scaled for visualization), periods in seconds (scaled)
    sun: {
        name: 'Sun',
        radius: 69.6, // Scaled
        texture: new THREE.TextureLoader().load('assets/textures/2k_sun.jpg') // Placeholder
    },
    planets: [
        {
            name: 'Mercury',
            radius: 2.4,
            orbitRadius: 58,
            orbitPeriod: 15,
            texture: new THREE.TextureLoader().load('assets/textures/2k_mercury.jpg')
        },
        {
            name: 'Venus',
            radius: 6.1,
            orbitRadius: 108,
            orbitPeriod: 38,
            texture: new THREE.TextureLoader().load('assets/textures/2k_venus_surface.jpg')
        },
        {
            name: 'Earth',
            radius: 6.4,
            orbitRadius: 150,
            orbitPeriod: 60,
            texture: new THREE.TextureLoader().load('assets/textures/2k_earth_daymap.jpg'),
            moons: [
                {
                    name: 'Moon',
                    radius: 1.7,
                    orbitRadius: 10,
                    orbitPeriod: 5,
                    texture: new THREE.TextureLoader().load('assets/textures/2k_moon.jpg')
                }
            ]
        },
        {
            name: 'Mars',
            radius: 3.4,
            orbitRadius: 228,
            orbitPeriod: 112,
            texture: new THREE.TextureLoader().load('assets/textures/2k_mars.jpg')
        },
        {
            name: 'Jupiter',
            radius: 69.9,
            orbitRadius: 778,
            orbitPeriod: 712,
            texture: new THREE.TextureLoader().load('assets/textures/2k_jupiter.jpg')
        },
        {
            name: 'Saturn',
            radius: 58.2,
            orbitRadius: 1430,
            orbitPeriod: 1760,
            texture: new THREE.TextureLoader().load('assets/textures/2k_saturn.jpg')
        },
        {
            name: 'Uranus',
            radius: 25.3,
            orbitRadius: 2870,
            orbitPeriod: 5000,
            texture: new THREE.TextureLoader().load('assets/textures/2k_uranus.jpg')
        },
        {
            name: 'Neptune',
            radius: 24.6,
            orbitRadius: 4500,
            orbitPeriod: 10000,
            texture: new THREE.TextureLoader().load('assets/textures/2k_neptune.jpg')
        }
    ]
};
// Note: Add more moons, dwarf planets, or custom bodies as needed. Adjust scaling for visual clarity.
