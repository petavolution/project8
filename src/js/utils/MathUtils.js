/**
 * MathUtils.js - Math utility functions for the game
 */

const MathUtils = {
    /**
     * Convert degrees to radians
     * @param {number} degrees - Angle in degrees
     * @returns {number} Angle in radians
     */
    degToRad: function(degrees) {
        return degrees * (Math.PI / 180);
    },
    
    /**
     * Convert radians to degrees
     * @param {number} radians - Angle in radians
     * @returns {number} Angle in degrees
     */
    radToDeg: function(radians) {
        return radians * (180 / Math.PI);
    },
    
    /**
     * Clamp a value between a minimum and maximum
     * @param {number} value - Value to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Clamped value
     */
    clamp: function(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },
    
    /**
     * Linear interpolation between two values
     * @param {number} a - Start value
     * @param {number} b - End value
     * @param {number} t - Interpolation factor (0-1)
     * @returns {number} Interpolated value
     */
    lerp: function(a, b, t) {
        return a + (b - a) * this.clamp(t, 0, 1);
    },
    
    /**
     * Generate a random number between min and max
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random number
     */
    random: function(min, max) {
        return min + Math.random() * (max - min);
    },
    
    /**
     * Generate a random integer between min and max (inclusive)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random integer
     */
    randomInt: function(min, max) {
        return Math.floor(min + Math.random() * (max - min + 1));
    },
    
    /**
     * Calculate distance between two points in 3D space
     * @param {Object} p1 - First point {x, y, z}
     * @param {Object} p2 - Second point {x, y, z}
     * @returns {number} Distance
     */
    distance: function(p1, p2) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dz = p2.z - p1.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    },
    
    /**
     * Round a number to a specified number of decimal places
     * @param {number} value - Value to round
     * @param {number} decimals - Number of decimal places
     * @returns {number} Rounded value
     */
    round: function(value, decimals = 0) {
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    }
};

// Export for use in other modules
window.MathUtils = MathUtils; 