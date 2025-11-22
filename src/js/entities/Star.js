/**
 * Star.js - Represents a star in the solar system
 */

class Star extends Entity {
    constructor(config = {}) {
        super();
        
        // Star properties
        this.name = config.name || 'Sun';
        this.radius = config.radius || 5;
        this.color = config.color || 0xffff00;
        this.intensity = config.intensity || 1.0;
        this.rotationSpeed = config.rotationSpeed || 0.1;
        
        // Create the 3D object
        this._createObject();
        
        console.log(`Star created: ${this.name}`);
    }
    
    /**
     * Create the star object
     */
    _createObject() {
        // Create star geometry
        const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
        
        // Create material
        let material;
        if (window.engine && window.engine.assetManager) {
            const texture = window.engine.assetManager.getTexture('star');
            if (texture) {
                material = new THREE.MeshBasicMaterial({
                    map: texture,
                    color: this.color,
                    emissive: this.color,
                    emissiveIntensity: 0.5
                });
            } else {
                material = new THREE.MeshBasicMaterial({
                    color: this.color,
                    emissive: this.color,
                    emissiveIntensity: 0.5
                });
            }
        } else {
            material = new THREE.MeshBasicMaterial({
                color: this.color,
                emissive: this.color,
                emissiveIntensity: 0.5
            });
        }
        
        // Create star mesh
        this.object = new THREE.Mesh(geometry, material);
        
        // Create light for star
        this._createLight();
        
        // Create corona effect
        this._createCorona();
        
        // Create lens flare
        this._createLensFlare();
    }
    
    /**
     * Create light for the star
     */
    _createLight() {
        // Add point light
        const light = new THREE.PointLight(this.color, this.intensity, 100, 2);
        this.object.add(light);
        this.light = light;
    }
    
    /**
     * Create corona effect for the star
     */
    _createCorona() {
        // Create larger sphere for corona
        const geometry = new THREE.SphereGeometry(this.radius * 1.2, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color: this.color,
            transparent: true,
            opacity: 0.3,
            side: THREE.BackSide
        });
        
        const corona = new THREE.Mesh(geometry, material);
        this.object.add(corona);
        this.corona = corona;
    }
    
    /**
     * Create lens flare effect
     */
    _createLensFlare() {
        // This is just a placeholder since ThreeJS lensflare requires textures
        // In a real implementation, this would create lens flare effects
        this.hasLensFlare = true;
    }
    
    /**
     * Update the star's rotation and effects
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        if (!this.object) return;
        
        // Rotate the star
        this.object.rotation.y += this.rotationSpeed * deltaTime;
        
        // Pulse the corona slightly
        if (this.corona) {
            const scale = 1.0 + 0.05 * Math.sin(Date.now() * 0.001);
            this.corona.scale.set(scale, scale, scale);
        }
    }
    
    /**
     * Get the star's radius
     * @returns {number} The star's radius
     */
    getRadius() {
        return this.radius;
    }
    
    /**
     * Get the star's intensity
     * @returns {number} The star's light intensity
     */
    getIntensity() {
        return this.intensity;
    }
    
    /**
     * Set the star's intensity
     * @param {number} value - The new intensity value
     */
    setIntensity(value) {
        this.intensity = value;
        if (this.light) {
            this.light.intensity = value;
        }
    }
}

// Export for use in other modules
window.Star = Star; 