/**
 * SolarSystem.js - Manages celestial bodies in the solar system
 */

class SolarSystem {
    constructor() {
        console.log('Creating SolarSystem instance');
        
        // Create container object for all celestial bodies
        this.object = new THREE.Object3D();
        this.object.name = 'SolarSystem';
        
        // Initialize collections
        this.planets = [];
        this.stars = [];
        this.asteroids = [];
        
        // Create default celestial bodies if config is not available
        this._createDefaultSystem();
    }
    
    /**
     * Create default solar system with a star and planets
     */
    _createDefaultSystem() {
        try {
            // Create star (sun)
            const sun = new Star({
                name: 'Sun',
                radius: 5,
                color: 0xffff00
            });
            
            this.stars.push(sun);
            if (sun.object) {
                this.object.add(sun.object);
            }
            
            // Create planets if Planet class exists
            if (typeof Planet !== 'undefined') {
                this._createPlanets();
            }
            
            console.log('Default solar system created');
        } catch (error) {
            console.error('Error creating default solar system:', error);
            
            // Create a simple fallback sun
            const geometry = new THREE.SphereGeometry(5, 32, 32);
            const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
            const sunObject = new THREE.Mesh(geometry, material);
            this.object.add(sunObject);
        }
    }
    
    /**
     * Create the planets in the solar system
     */
    _createPlanets() {
        // Create Mercury
        const mercury = new Planet({
            name: 'Mercury',
            radius: 0.8,
            orbitRadius: 10,
            orbitSpeed: 4.1,
            rotationSpeed: 0.01,
            color: 0xaaaaaa
        });
        
        // Create Venus
        const venus = new Planet({
            name: 'Venus',
            radius: 1.2,
            orbitRadius: 15,
            orbitSpeed: 1.6,
            rotationSpeed: 0.004,
            color: 0xe6c300
        });
        
        // Create Earth
        const earth = new Planet({
            name: 'Earth',
            radius: 1.5,
            orbitRadius: 20,
            orbitSpeed: 1,
            rotationSpeed: 0.01,
            color: 0x0099ff,
            hasAtmosphere: true
        });
        
        // Create Mars
        const mars = new Planet({
            name: 'Mars',
            radius: 1.2,
            orbitRadius: 25,
            orbitSpeed: 0.8,
            rotationSpeed: 0.009,
            color: 0xff6600
        });
        
        // Create Jupiter
        const jupiter = new Planet({
            name: 'Jupiter',
            radius: 3,
            orbitRadius: 40,
            orbitSpeed: 0.4,
            rotationSpeed: 0.02,
            color: 0xffaa88,
            hasRings: true
        });
        
        // Create Saturn
        const saturn = new Planet({
            name: 'Saturn',
            radius: 2.5,
            orbitRadius: 55,
            orbitSpeed: 0.3,
            rotationSpeed: 0.018,
            color: 0xffd700,
            hasRings: true
        });
        
        // Add planets to the collection
        this.planets.push(mercury, venus, earth, mars, jupiter, saturn);
        
        // Add planet objects to the solar system
        for (const planet of this.planets) {
            if (planet.object) {
                this.object.add(planet.object);
            }
        }
    }
    
    /**
     * Update all celestial bodies in the solar system
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        // Update stars
        for (const star of this.stars) {
            star.update(deltaTime);
        }
        
        // Update planets
        for (const planet of this.planets) {
            planet.update(deltaTime);
        }
        
        // Update asteroids
        for (const asteroid of this.asteroids) {
            asteroid.update(deltaTime);
        }
    }
    
    /**
     * Get all planets in the solar system
     * @returns {Array} List of planets
     */
    getPlanets() {
        return this.planets;
    }
    
    /**
     * Get all stars in the solar system
     * @returns {Array} List of stars
     */
    getStars() {
        return this.stars;
    }

    /**
     * Get the sun (primary star)
     * @returns {Star} The sun or null
     */
    get sun() {
        return this.stars.length > 0 ? this.stars[0] : null;
    }
    
    /**
     * Get celestial body by name
     * @param {string} name - Name of the celestial body
     * @returns {Object} Celestial body or null if not found
     */
    getBodyByName(name) {
        // Search in planets
        const planet = this.planets.find(p => p.name === name);
        if (planet) return planet;
        
        // Search in stars
        const star = this.stars.find(s => s.name === name);
        if (star) return star;
        
        // Search in asteroids
        const asteroid = this.asteroids.find(a => a.name === name);
        if (asteroid) return asteroid;
        
        return null;
    }
}

// Export for use in other modules
window.SolarSystem = SolarSystem; 