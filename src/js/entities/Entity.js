/**
 * Entity.js - Base class for all game entities
 */

class Entity {
    constructor() {
        this.object = null;
        this.isActive = true;
        this.id = Entity.generateId();
        
        console.log(`Creating Entity: ${this.id}`);
    }
    
    /**
     * Generate a unique ID for the entity
     */
    static generateId() {
        if (!Entity.lastId) Entity.lastId = 0;
        return ++Entity.lastId;
    }
    
    /**
     * Initialize the entity
     */
    init() {
        // Override in subclasses
    }
    
    /**
     * Update the entity
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        // Override in subclasses
    }
    
    /**
     * Get the position of the entity
     * @returns {THREE.Vector3} The entity's position
     */
    getPosition() {
        if (!this.object) return { x: 0, y: 0, z: 0 };
        return this.object.position;
    }
    
    /**
     * Set the position of the entity
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} z - Z coordinate
     */
    setPosition(x, y, z) {
        if (this.object) {
            this.object.position.set(x, y, z);
        }
    }
    
    /**
     * Get the rotation of the entity
     * @returns {THREE.Euler} The entity's rotation
     */
    getRotation() {
        if (!this.object) return { x: 0, y: 0, z: 0 };
        return this.object.rotation;
    }
    
    /**
     * Set the rotation of the entity
     * @param {number} x - X rotation
     * @param {number} y - Y rotation
     * @param {number} z - Z rotation
     */
    setRotation(x, y, z) {
        if (this.object) {
            this.object.rotation.set(x, y, z);
        }
    }
    
    /**
     * Destroy the entity
     */
    destroy() {
        this.isActive = false;
    }
}

// Export for use in other modules
window.Entity = Entity; 