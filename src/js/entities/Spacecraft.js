/**
 * Spacecraft.js - Player-controlled spacecraft entity
 */

class Spacecraft extends Entity {
    constructor(config = {}) {
        super();
        console.log('Creating Spacecraft instance');
        
        // Spacecraft properties
        this.name = config.name || 'Spacecraft';
        this.speed = config.speed || 0;
        this.maxSpeed = config.maxSpeed || 2;
        this.acceleration = config.acceleration || 0.05;
        this.rotationSpeed = config.rotationSpeed || 0.02;
        this.fuel = config.fuel || 100;
        this.maxFuel = config.maxFuel || 100;
        this.fuelConsumption = config.fuelConsumption || 0.1;
        
        // Movement state
        this.velocity = { x: 0, y: 0, z: 0 };
        this.rotation = { x: 0, y: 0, z: 0 };
        this.isAccelerating = false;
        this.isDecelerating = false;
        this.isTurningLeft = false;
        this.isTurningRight = false;
        this.isPitchingUp = false;
        this.isPitchingDown = false;
        
        // Create 3D object
        this._createObject();
        
        // Lighting effects
        this.thrusterLight = null;
        this._createThrusterLight();
    }
    
    /**
     * Create spacecraft 3D object
     */
    _createObject() {
        try {
            // Check if THREE is available
            if (typeof THREE === 'undefined') {
                console.error('THREE is not defined, cannot create spacecraft model');
                return;
            }
            
            // Try to use model if available from asset manager
            if (window.engine && window.engine.assetManager) {
                try {
                    const model = window.engine.assetManager.getModel('spacecraft');
                    if (model && model.scene) {
                        this.object = model.scene.clone();
                        this.object.scale.set(0.5, 0.5, 0.5);
                        this.object.position.set(60, 3, 60);
                        console.log('Using GLTF spacecraft model');
                        return;
                    }
                } catch (modelError) {
                    console.warn('Could not load spacecraft model:', modelError);
                }
            }
            
            // Fallback to simple geometry
            this._createSimpleSpacecraft();
        } catch (error) {
            console.error('Error creating spacecraft model:', error);
            this._createSimpleSpacecraft();
        }
    }
    
    /**
     * Create a simple spacecraft model as fallback
     */
    _createSimpleSpacecraft() {
        // Check if THREE is available
        if (typeof THREE === 'undefined') {
            console.error('THREE is not defined, cannot create simple spacecraft model');
            return;
        }
        
        try {
            // Create a simple spacecraft shape
            this.object = new THREE.Object3D();
            
            // Main body - box
            const bodyGeometry = new THREE.BoxGeometry(2, 0.5, 4);
            const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            this.object.add(body);
            
            // Cockpit - hemisphere
            const cockpitGeometry = new THREE.SphereGeometry(0.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
            const cockpitMaterial = new THREE.MeshPhongMaterial({ color: 0x3333ff, transparent: true, opacity: 0.7 });
            const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
            cockpit.position.set(0, 0.3, 0.5);
            this.object.add(cockpit);
            
            // Wings
            const wingGeometry = new THREE.BoxGeometry(5, 0.1, 2);
            const wingMaterial = new THREE.MeshPhongMaterial({ color: 0xcc3333 });
            const wings = new THREE.Mesh(wingGeometry, wingMaterial);
            wings.position.set(0, 0, -0.5);
            this.object.add(wings);
            
            // Thrusters
            const thrusterGeometry = new THREE.CylinderGeometry(0.3, 0.5, 0.5, 16);
            const thrusterMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });
            
            // Left thruster
            const leftThruster = new THREE.Mesh(thrusterGeometry, thrusterMaterial);
            leftThruster.position.set(-1, 0, -2);
            leftThruster.rotation.x = Math.PI / 2;
            this.object.add(leftThruster);
            
            // Right thruster
            const rightThruster = new THREE.Mesh(thrusterGeometry, thrusterMaterial);
            rightThruster.position.set(1, 0, -2);
            rightThruster.rotation.x = Math.PI / 2;
            this.object.add(rightThruster);
            
            // Initial position
            this.object.position.set(60, 3, 60);
            this.object.rotation.y = Math.PI;
            
            console.log('Created simple spacecraft model');
        } catch (error) {
            console.error('Failed to create simple spacecraft model:', error);
            // Create an empty object as last resort
            this.object = { 
                position: { x: 60, y: 3, z: 60, set: function() {} },
                rotation: { x: 0, y: Math.PI, z: 0 },
                quaternion: { x: 0, y: 0, z: 0, w: 1 },
                add: function() {}
            };
        }
    }
    
    /**
     * Create thruster light effect
     */
    _createThrusterLight() {
        try {
            if (typeof THREE === 'undefined') {
                console.warn('THREE is not defined, skipping thruster light creation');
                return;
            }
            
            this.thrusterLight = new THREE.PointLight(0xff6666, 0, 5);
            this.thrusterLight.position.set(0, 0, -2);
            if (this.object && this.object.add) {
                this.object.add(this.thrusterLight);
            }
        } catch (error) {
            console.warn('Could not create thruster light:', error);
        }
    }
    
    /**
     * Update the spacecraft position and rotation
     * @param {number} deltaTime - Time since last update
     * @param {Array} celestialBodies - Array of celestial bodies (optional)
     */
    update(deltaTime, celestialBodies = []) {
        if (!this.object) return;
        
        // Import Gravity utility
        let Gravity = null;
        if (typeof window !== 'undefined' && window.Gravity) Gravity = window.Gravity;
        try { if (!Gravity) Gravity = require('../utils/Gravity.js').Gravity; } catch (e) {}
        if (!Gravity) {
            console.warn('Gravity utility not found');
            return;
        }

        // --- Physics-based update ---
        // 1. Accumulate forces: gravity + thrust
        const mass = this.mass; // Arbitrary mass for the spacecraft (simulation units)
        let force = { x: 0, y: 0, z: 0 };

        // Gravity from celestial bodies (for now, only the Sun at origin)
        let sunMass = 2e30; // Approximate mass of Sun in kg (can be scaled)
        let sunPos = { x: 0, y: 0, z: 0 };
        // If celestialBodies array is provided, find the Sun
        if (celestialBodies && celestialBodies.length) {
            for (let body of celestialBodies) {
                if (body.name && body.name.toLowerCase() === 'sun') {
                    sunMass = body.mass || sunMass;
                    sunPos = body.getPosition ? body.getPosition() : sunPos;
                }
            }
        }
        const gForce = Gravity.calculateForce(mass, sunMass, this.getPosition(), sunPos);
        force.x += gForce.x;
        force.y += gForce.y;
        force.z += gForce.z;

        // Thrust (in direction of spacecraft orientation)
        let thrust = 0;
        if (this.isAccelerating && this.fuel > 0) {
            thrust = this.acceleration * mass; // F = m * a
            this.fuel -= this.fuelConsumption * deltaTime;
            if (this.fuel < 0) this.fuel = 0;
        }
        // Direction vector from rotation
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyEuler(this.object.rotation);
        force.x += direction.x * thrust;
        force.y += direction.y * thrust;
        force.z += direction.z * thrust;

        // 2. Integrate acceleration to velocity, velocity to position
        const acceleration = {
            x: force.x / mass,
            y: force.y / mass,
            z: force.z / mass
        };
        this.velocity.x += acceleration.x * deltaTime;
        this.velocity.y += acceleration.y * deltaTime;
        this.velocity.z += acceleration.z * deltaTime;

        // Cap speed at maxSpeed
        const vMag = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2 + this.velocity.z ** 2);
        if (vMag > this.maxSpeed) {
            this.velocity.x *= this.maxSpeed / vMag;
            this.velocity.y *= this.maxSpeed / vMag;
            this.velocity.z *= this.maxSpeed / vMag;
        }

        // Update position
        this.object.position.x += this.velocity.x * deltaTime;
        this.object.position.y += this.velocity.y * deltaTime;
        this.object.position.z += this.velocity.z * deltaTime;

        // --- Rotation controls ---
        if (this.isTurningLeft) {
            this.object.rotation.y += this.rotationSpeed * deltaTime;
        }
        if (this.isTurningRight) {
            this.object.rotation.y -= this.rotationSpeed * deltaTime;
        }
        if (this.isPitchingUp) {
            this.object.rotation.x += this.rotationSpeed * deltaTime * 0.5;
            this.object.rotation.x = Math.min(this.object.rotation.x, Math.PI / 4);
        }
        if (this.isPitchingDown) {
            this.object.rotation.x -= this.rotationSpeed * deltaTime * 0.5;
            this.object.rotation.x = Math.max(this.object.rotation.x, -Math.PI / 4);
        }

        // Thruster light intensity
        if (this.thrusterLight) {
            this.thrusterLight.intensity = this.isAccelerating ? 1.5 : 0;
            }
        }
        
        try {
            // Calculate direction vector based on rotation
            let direction;
            if (typeof THREE !== 'undefined') {
                direction = new THREE.Vector3(0, 0, -1);
                if (this.object.quaternion) {
                    direction.applyQuaternion(this.object.quaternion);
                }
            } else {
                // Fallback if THREE is not defined
                const rotY = this.object.rotation.y;
                direction = {
                    x: Math.sin(rotY),
                    y: 0,
                    z: -Math.cos(rotY)
                };
            }
            
            // Update position based on velocity
            this.object.position.x += direction.x * this.speed * deltaTime;
            this.object.position.y += direction.y * this.speed * deltaTime;
            this.object.position.z += direction.z * this.speed * deltaTime;
        } catch (error) {
            console.error('Error updating spacecraft position:', error);
        }
        
        // Send position to UI
        if (window.showCoordinates) {
            try {
                window.showCoordinates(this.object.position);
            } catch (error) {
                console.warn('Error showing coordinates:', error);
            }
        }
    }
    
    /**
     * Control methods for user input
     */
    accelerate(active) {
        this.isAccelerating = active;
    }
    
    decelerate(active) {
        this.isDecelerating = active;
    }
    
    turnLeft(active) {
        this.isTurningLeft = active;
    }
    
    turnRight(active) {
        this.isTurningRight = active;
    }
    
    pitchUp(active) {
        this.isPitchingUp = active;
    }
    
    pitchDown(active) {
        this.isPitchingDown = active;
    }
    
    /**
     * Get spacecraft position
     * @returns {Object} Position vector
     */
    getPosition() {
        if (!this.object) return { x: 0, y: 0, z: 0 };
        return this.object.position;
    }
    
    /**
     * Get spacecraft rotation
     * @returns {Object} Rotation euler angles
     */
    getRotation() {
        if (!this.object) return { x: 0, y: 0, z: 0 };
        return this.object.rotation;
    }
    
    /**
     * Get spacecraft speed
     * @returns {number} Current speed
     */
    getSpeed() {
        return this.speed;
    }
    
    /**
     * Get fuel level
     * @returns {number} Current fuel level
     */
    getFuel() {
        return this.fuel;
    }
}

// Export for use in other modules
window.Spacecraft = Spacecraft; 