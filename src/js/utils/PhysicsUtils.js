/**
 * PhysicsUtils.js - Physics utility functions for the game
 */

const PhysicsUtils = {
    // Constants
    G: 6.674e-11, // Gravitational constant
    
    /**
     * Calculate gravitational force between two objects
     * @param {number} m1 - Mass of first object
     * @param {number} m2 - Mass of second object
     * @param {number} distance - Distance between objects
     * @returns {number} Gravitational force
     */
    gravitationalForce: function(m1, m2, distance) {
        return this.G * (m1 * m2) / (distance * distance);
    },
    
    /**
     * Calculate orbital velocity for circular orbit
     * @param {number} centralMass - Mass of central body
     * @param {number} distance - Distance from central body
     * @returns {number} Orbital velocity
     */
    orbitalVelocity: function(centralMass, distance) {
        return Math.sqrt(this.G * centralMass / distance);
    },
    
    /**
     * Calculate escape velocity from a body
     * @param {number} mass - Mass of the body
     * @param {number} radius - Radius of the body
     * @returns {number} Escape velocity
     */
    escapeVelocity: function(mass, radius) {
        return Math.sqrt(2 * this.G * mass / radius);
    },
    
    /**
     * Apply drag force to velocity
     * @param {Object} velocity - Velocity vector {x, y, z}
     * @param {number} dragCoefficient - Drag coefficient
     * @param {number} deltaTime - Time since last update
     * @returns {Object} New velocity after drag
     */
    applyDrag: function(velocity, dragCoefficient, deltaTime) {
        const speed = Math.sqrt(
            velocity.x * velocity.x + 
            velocity.y * velocity.y + 
            velocity.z * velocity.z
        );
        
        if (speed === 0) return velocity;
        
        const dragFactor = 1 - (dragCoefficient * speed * deltaTime);
        const clampedDragFactor = Math.max(0, dragFactor);
        
        return {
            x: velocity.x * clampedDragFactor,
            y: velocity.y * clampedDragFactor,
            z: velocity.z * clampedDragFactor
        };
    },
    
    /**
     * Calculate orbital period using Kepler's third law
     * @param {number} semiMajorAxis - Semi-major axis of orbit
     * @param {number} centralMass - Mass of central body
     * @returns {number} Orbital period
     */
    orbitalPeriod: function(semiMajorAxis, centralMass) {
        return 2 * Math.PI * Math.sqrt(Math.pow(semiMajorAxis, 3) / (this.G * centralMass));
    },
    
    /**
     * Check if two spheres are colliding
     * @param {Object} pos1 - Position of first sphere {x, y, z}
     * @param {number} radius1 - Radius of first sphere
     * @param {Object} pos2 - Position of second sphere {x, y, z}
     * @param {number} radius2 - Radius of second sphere
     * @returns {boolean} True if spheres are colliding
     */
    sphereCollision: function(pos1, radius1, pos2, radius2) {
        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        const dz = pos2.z - pos1.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        return distance < (radius1 + radius2);
    },
    
    /**
     * Calculate kinetic energy
     * @param {number} mass - Mass of object
     * @param {number} velocity - Velocity of object
     * @returns {number} Kinetic energy
     */
    kineticEnergy: function(mass, velocity) {
        return 0.5 * mass * velocity * velocity;
    }
};

// Export for use in other modules
window.PhysicsUtils = PhysicsUtils; 