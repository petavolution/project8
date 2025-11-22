// SceneManager.js - Handles Three.js scene, camera, and renderer

class SceneManager {
    constructor(container) {
        // Check if THREE is defined
        if (typeof THREE === 'undefined') {
            console.error('THREE is not defined. SceneManager requires Three.js to be loaded first.');
            // Create dummy objects to prevent immediate failures
            this.scene = { add: () => {}, children: [] };
            this.camera = {};
            this.renderer = { 
                render: () => {},
                setSize: () => {},
                domElement: document.createElement('div')
            };
            this.updateables = [];
            
            // Set an error flag
            this.initializationFailed = true;
            return;
        }
    
        // Store container reference
        this.container = container || document.getElementById('game-container');
        if (!this.container) {
            // Create container if it doesn't exist
            this.container = document.createElement('div');
            this.container.id = 'game-container';
            this.container.style.width = '100%';
            this.container.style.height = '100%';
            this.container.style.position = 'absolute';
            this.container.style.top = '0';
            this.container.style.left = '0';
            document.body.appendChild(this.container);
            console.log('Created game container');
        }
        
        try {
            // Initialize core Three.js components
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x000000);
            
            this.createCamera();
            this.createRenderer();
            
            // Add window resize handler
            window.addEventListener('resize', this.onWindowResize.bind(this));
            
            // Setup performance monitoring
            this.clock = new THREE.Clock();
            this.stats = null;
            
            // Frame tracking
            this.lastTime = 0;
            this.frameTime = 0;
            
            // Object collections
            this.updateables = [];
            
            // Camera modes: 'orbit' (default), 'follow', 'free'
            this.cameraMode = 'orbit';
            this.targetObject = null;
            
            // Store positions for free camera mode
            this.freeCameraPosition = null;
            this.freeCameraRotation = null;
            
            // Callbacks to be executed in the render loop
            this.loopCallbacks = [];
            
            console.log('SceneManager initialized');
            this.initializationFailed = false;
        } catch (error) {
            console.error('Failed to initialize SceneManager:', error);
            // Create dummy objects to prevent immediate failures
            this.scene = { add: () => {}, children: [] };
            this.camera = {};
            this.renderer = { 
                render: () => {},
                setSize: () => {},
                domElement: document.createElement('div')
            };
            this.updateables = [];
            
            // Set an error flag
            this.initializationFailed = true;
        }
    }
    
    /**
     * Creates the camera and its controls
     */
    createCamera() {
        // Create perspective camera
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            2000
        );
        
        // Position camera for initial view - positioned to see player ship and asteroid field
        // Player is at (60, 3, 60), so we position camera at a slight offset
        this.camera.position.set(100, 30, 100); // Moved farther back and higher up
        this.camera.lookAt(60, 3, 60); // Look at player start position
        
        // Use the appropriate OrbitControls constructor
        if (typeof OrbitControls !== 'undefined') {
            this.controls = new OrbitControls(this.camera, this.container);
        } else if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.container);
        } else {
            console.error('OrbitControls not available');
            this.controls = {
                enableDamping: false,
                dampingFactor: 0,
                minDistance: 3,
                maxDistance: 300,
                update: function() {},
                target: new THREE.Vector3(60, 3, 60),
                enabled: false
            };
        }
        
        // Configure the controls
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 300; // Increased max distance
        
        // Set initial target to player start position
        this.controls.target.set(60, 3, 60);
    }
    
    /**
     * Creates the WebGL renderer
     */
    createRenderer() {
        // Create WebGL renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            powerPreference: 'high-performance'
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for performance
        
        // Check for newer versions of THREE
        if (typeof this.renderer.outputEncoding !== 'undefined') {
            this.renderer.outputEncoding = THREE.sRGBEncoding;
        } else if (typeof this.renderer.outputColorSpace !== 'undefined') {
            this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        }
        
        // Enable shadows (if needed)
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Add renderer to DOM
        this.container.appendChild(this.renderer.domElement);
    }
    
    /**
     * Handles window resize events
     */
    onWindowResize() {
        // Update camera aspect ratio
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        
        // Update renderer size
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    /**
     * Enables performance stats display
     */
    enableStats() {
        if (typeof Stats !== 'undefined') {
            this.stats = new Stats();
            document.body.appendChild(this.stats.dom);
        }
    }
    
    /**
     * Adds an object to the scene
     * @param {Object} object - The object to add
     */
    add(object) {
        this.scene.add(object);
        
        // If object has update method, add to updateables
        if (object.update && typeof object.update === 'function') {
            this.updateables.push(object);
        }
    }
    
    /**
     * Adds lights to the scene
     */
    addLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 3, 5);
        directionalLight.castShadow = true;
        
        // Optimize shadow map
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        
        this.scene.add(directionalLight);
        
        // Opposite directional light for better visibility
        const additionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
        additionalLight.position.set(-5, 2, -5);
        this.scene.add(additionalLight);
        
        // Add a sun point light with distance falloff
        const sunLight = new THREE.PointLight(0xffffee, 1, 100, 2);
        sunLight.position.set(0, 0, 0); // Will be positioned at the sun location
        this.sunLight = sunLight; // Store reference for updates
        this.scene.add(sunLight);
    }
    
    /**
     * Updates all scene components
     * @param {number} deltaTime - Time elapsed since last update
     */
    update(deltaTime) {
        if (this.initializationFailed) return;
        
        try {
            // Calculate frame time
            const currentTime = this.clock.getElapsedTime();
            this.frameTime = currentTime - this.lastTime;
            this.lastTime = currentTime;
            
            // Update stats if enabled
            if (this.stats) this.stats.update();
            
            // Update controls
            if (this.controls && this.controls.update) this.controls.update();
            
            // Update all objects with update method
            for (const object of this.updateables) {
                if (object && object.update) {
                    object.update(this.frameTime);
                }
            }
        } catch (error) {
            console.error('Error in SceneManager.update:', error);
        }
    }
    
    /**
     * Renders the scene
     */
    render() {
        if (this.initializationFailed) return;
        
        try {
            this.renderer.render(this.scene, this.camera);
        } catch (error) {
            console.error('Error in SceneManager.render:', error);
        }
    }
    
    /**
     * Animation loop
     */
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        this.update();
        this.render();
    }
    
    /**
     * Starts the animation loop
     */
    start() {
        this.animate();
    }
    
    /**
     * Sets camera mode
     * @param {string} mode - Camera mode ('orbit', 'follow', 'free')
     * @param {Object} target - Optional target object
     * @returns {string} - The camera mode that was set
     */
    setCameraMode(mode, target = null) {
        // Store previous mode
        const previousMode = this.cameraMode;
        
        // Set new mode
        this.cameraMode = mode;
        
        switch(mode) {
            case 'orbit':
                this.controls.enabled = true;
                break;
                
            case 'follow':
                this.controls.enabled = false;
                if (this.targetObject) {
                    // Position camera behind target
                    const offset = new THREE.Vector3(0, 5, -15);
                    offset.applyQuaternion(this.targetObject.quaternion);
                    this.camera.position.copy(this.targetObject.position).add(offset);
                    this.camera.lookAt(this.targetObject.position);
                }
                break;
                
            case 'free':
                this.controls.enabled = true;
                // Store current camera position and rotation if switching to free mode
                this.freeCameraPosition = this.camera.position.clone();
                this.freeCameraRotation = this.camera.rotation.clone();
                break;
                
            default:
                console.warn(`Unknown camera mode: ${mode}`);
                this.cameraMode = previousMode; // Revert to previous mode
                break;
        }
        
        // If target is provided, update target
        if (target) {
            this.setCameraTarget(target);
        }
        
        return this.cameraMode;
    }
    
    /**
     * Updates the sun light position
     * @param {THREE.Vector3} sunPosition - Position of the sun
     */
    updateSunLight(sunPosition) {
        if (this.sunLight && sunPosition) {
            this.sunLight.position.copy(sunPosition);
        }
    }
    
    /**
     * Toggle between available camera modes
     * @returns {string} The new camera mode
     */
    toggleCameraMode() {
        const modes = ['orbit', 'follow', 'free'];
        const currentIndex = modes.indexOf(this.cameraMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        const newMode = modes[nextIndex];
        
        return this.setCameraMode(newMode);
    }
    
    /**
     * Set camera to target a specific object
     * @param {THREE.Object3D} object The object to target
     */
    setCameraTarget(object) {
        if (!object) return;
        
        this.targetObject = object;
        this.controls.target.copy(object.position);
        
        // If in follow mode, update camera position
        if (this.cameraMode === 'follow' && this.targetObject) {
            // Calculate offset based on object orientation
            const offset = new THREE.Vector3(0, 5, -15); // Default behind and above
            offset.applyQuaternion(object.quaternion);
            
            // Set camera position relative to object
            this.camera.position.copy(object.position).add(offset);
            this.camera.lookAt(object.position);
        }
    }
    
    /**
     * Clean up resources
     */
    cleanup() {
        // Remove event listeners
        window.removeEventListener('resize', this.onWindowResize.bind(this));
        
        // Dispose of renderer
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        // Clear scene
        this.updateables = [];
        
        // Remove stats if present
        if (this.stats) {
            document.body.removeChild(this.stats.dom);
            this.stats = null;
        }
        
        console.log('SceneManager cleaned up');
    }
}

// Export the class
window.SceneManager = SceneManager; 