/**
 * Game.js - Game-specific logic and gameplay management
 * Handles game entities, gameplay, and user interactions
 * Works with the Engine which manages the core systems
 */

class Game {
    constructor(engine) {
        // Store reference to the engine
        this.engine = engine || window.engine;
        if (!this.engine) {
            console.error('Game created without engine reference');
        }
        
        // Game state
        this.initialized = false;
        this.paused = false;
        
        // Game entities
        this.solarSystem = null;
        this.spacecraft = null;
        this.environment = null;
        
        // Collision settings
        this.lastCollisionTime = 0;
        this.collisionCooldown = 1.5; // seconds
        this.WARNING_DISTANCE = 2; // Distance for proximity warning
        this.COLLISION_DISTANCE = 1; // Distance for actual collision
        this.SUN_WARNING_DISTANCE = 15; // Distance for sun heat warning
        
        // Gameplay tracking
        this.activeWarnings = {};
        this.lastSunWarningTime = 0;
        
        // Bind methods
        this.update = this.update.bind(this);
    }
    
    /**
     * Initialize game entities and systems
     */
    async init() {
        if (this.initialized) return true;
        
        try {
            console.log('Initializing game logic...');
            
            // Get references to core systems from the engine
            const { sceneManager, assetManager, inputManager, audioManager } = this.engine;
            
            // Initialize environment
            this.environment = new Environment(sceneManager, assetManager);
            await this.environment.initialize();
            sceneManager.add(this.environment);
            
            // Initialize solar system
            this.solarSystem = new SolarSystem(sceneManager, assetManager);
            this.solarSystem.init();
            sceneManager.add(this.solarSystem);
            
            // Initialize spacecraft
            this.spacecraft = new Spacecraft(sceneManager, inputManager);
            await this.spacecraft.init();
            sceneManager.add(this.spacecraft);
            
            // Position the spacecraft at the starting position
            const startingPosition = CONFIG.spacecraft?.startingPosition || { x: 0, y: 0, z: 0 };
            this.spacecraft.setPosition(
                startingPosition.x || 0,
                startingPosition.y || 0,
                startingPosition.z || 0
            );
            
            // Set the camera to follow the spacecraft
            sceneManager.setCameraTarget(this.spacecraft.object);
            
            // Set up input controls
            this._setupControls(inputManager);
            
            // Add this game object to updateables
            sceneManager.add(this);
            
            this.initialized = true;
            console.log('Game logic initialized');
            return true;
        } catch (error) {
            console.error('Failed to initialize game logic:', error);
            return false;
        }
    }
    
    /**
     * Set up input controls for gameplay
     */
    _setupControls(inputManager) {
        // Camera toggle
        inputManager.onKey('c', (event) => {
            if (event.type === 'keydown') {
                this._toggleCamera();
                playSound('UI_click', { volume: 0.5 });
            }
        });
        
        // Other game-specific controls can be added here
        
        console.log('Game controls initialized');
    }
    
    /**
     * Toggles between camera modes
     */
    _toggleCamera() {
        const nextMode = this.engine.sceneManager.toggleCameraMode();
        console.log('Camera mode switched to:', nextMode);
        
        // Update HUD to indicate camera mode
        document.getElementById('camera-mode').textContent = `Camera: ${nextMode}`;
    }
    
    /**
     * Game update method (called by engine)
     */
    update(deltaTime) {
        if (!this.initialized || this.engine.isPaused) return;
        
        // Update collision detection
        this._updateCollisions(deltaTime);
    }
    
    /**
     * Updates collision detection
     */
    _updateCollisions(deltaTime) {
        if (!this.spacecraft || !this.solarSystem) return;
        
        const spacecraftPosition = this.spacecraft.getPosition();
        const now = performance.now() / 1000; // Convert to seconds
        
        // Skip if we're in cooldown
        if (now - this.lastCollisionTime < this.collisionCooldown) {
            return;
        }
        
        // Check for collisions with planets
        for (const planet of this.solarSystem.planets) {
            if (!planet) continue;
            
            const planetPosition = planet.getPosition();
            const distance = this._calculateDistance(spacecraftPosition, planetPosition);
            const collisionRadius = planet.radius + this.COLLISION_DISTANCE;
            const warningRadius = planet.radius + this.WARNING_DISTANCE;
            
            // Collision detected
            if (distance < collisionRadius) {
                this._handleCollision('planet', planet);
                break;
            }
            // Warning proximity
            else if (distance < warningRadius) {
                this._handleProximityWarning('planet', planet, distance - planet.radius);
            }
        }
        
        // Check for collision with sun (special case)
        const sun = this.solarSystem.sun;
        if (sun) {
            const sunPosition = sun.getPosition();
            const distanceToSun = this._calculateDistance(spacecraftPosition, sunPosition);
            
            // Too close to the sun
            if (distanceToSun < sun.radius + this.COLLISION_DISTANCE) {
                this._handleCollision('sun', sun);
            }
            // Warning for sun proximity (heat danger)
            else if (distanceToSun < sun.radius + this.SUN_WARNING_DISTANCE) {
                this._handleProximityWarning('sun', sun, distanceToSun - sun.radius);
            }
        }
        
        // Check for collisions with asteroids
        for (const asteroid of this.solarSystem.asteroids || []) {
            if (!asteroid) continue;
            
            const asteroidPosition = asteroid.getPosition();
            const distance = this._calculateDistance(spacecraftPosition, asteroidPosition);
            
            // Collision with asteroid
            if (distance < (asteroid.radius || 1) + this.COLLISION_DISTANCE) {
                this._handleCollision('asteroid', asteroid);
                break;
            }
            // Warning for asteroid proximity
            else if (distance < (asteroid.radius || 1) + this.WARNING_DISTANCE) {
                this._handleProximityWarning('asteroid', asteroid, distance - (asteroid.radius || 1));
            }
        }
        
        // Update coordinates display
        this._updateCoordinatesDisplay(spacecraftPosition);
    }
    
    /**
     * Handles a collision event
     */
    _handleCollision(type, object) {
        // Set cooldown to prevent multiple collisions
        this.lastCollisionTime = performance.now() / 1000;
        
        // Visual feedback
        if (this.spacecraft.showDamage) {
            this.spacecraft.showDamage();
        }
        
        // Play sound effect
        playSound('explosion', { volume: 0.8 });
        
        // Show impact message
        const message = `Impact with ${type}: ${object.name || 'unknown'}`;
        showMessage(message, 'error');
        
        // Apply damage to spacecraft
        if (this.spacecraft.applyDamage) {
            this.spacecraft.applyDamage(type === 'sun' ? 50 : 25);
        }
        
        console.log(`Collision with ${type}:`, object);
    }
    
    /**
     * Handles a proximity warning
     */
    _handleProximityWarning(type, object, distance) {
        // Different warning sounds/messages based on type and distance
        if (type === 'sun') {
            // Only show warning every 5 seconds for sun
            const now = performance.now() / 1000;
            if (now - this.lastSunWarningTime > 5) {
                this.lastSunWarningTime = now;
                showMessage(`WARNING: Extreme heat detected. Distance to ${object.name}: ${distance.toFixed(1)} units`, 'warning');
                playSound('warning', { volume: 0.5 });
            }
        } else {
            // Only show warning when we first get close
            const warningKey = `${type}_${object.id || object.name}`;
            if (!this.activeWarnings[warningKey]) {
                // Track this warning
                this.activeWarnings[warningKey] = true;
                
                // Show message
                showMessage(`PROXIMITY ALERT: ${object.name || type} - Distance: ${distance.toFixed(1)} units`, 'warning');
                
                // Play warning sound
                playSound('warning', { volume: 0.4 });
                
                // Clear the warning after some time to allow it to trigger again
                setTimeout(() => {
                    if (this.activeWarnings) {
                        delete this.activeWarnings[warningKey];
                    }
                }, 5000);
            }
        }
    }
    
    /**
     * Update coordinates display
     */
    _updateCoordinatesDisplay(position) {
        const xCoord = document.getElementById('x-coord');
        const yCoord = document.getElementById('y-coord');
        const zCoord = document.getElementById('z-coord');
        
        if (xCoord) xCoord.textContent = position.x.toFixed(1);
        if (yCoord) yCoord.textContent = position.y.toFixed(1);
        if (zCoord) zCoord.textContent = position.z.toFixed(1);
    }
    
    /**
     * Calculate distance between two positions
     */
    _calculateDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        const dz = pos1.z - pos2.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
}

// Export the class
window.Game = Game; 