// InputManager.js - Handles user input for game controls

const InputManager = {
    initialize() {
        // Key states
        this.keyboard = {
            keys: {},
            
            // Check if a key is currently pressed
            isPressed(key) {
                return this.keys[key] === true;
            },
            
            // Register a callback for key down events
            onKeyDown(key, callback) {
                document.addEventListener('keydown', (event) => {
                    if (event.code === key && !event.repeat) {
                        callback(event);
                    }
                });
            },
            
            // Register a callback for key up events
            onKeyUp(key, callback) {
                document.addEventListener('keyup', (event) => {
                    if (event.code === key) {
                        callback(event);
                    }
                });
            }
        };
        
        // Mouse state
        this.mouse = {
            x: 0,
            y: 0,
            isLeftButtonDown: false,
            isRightButtonDown: false,
            
            // Register a callback for mouse move events
            onMouseMove(callback) {
                document.addEventListener('mousemove', callback);
            },
            
            // Register a callback for mouse down events
            onMouseDown(callback) {
                document.addEventListener('mousedown', callback);
            },
            
            // Register a callback for mouse up events
            onMouseUp(callback) {
                document.addEventListener('mouseup', callback);
            }
        };
        
        // Initialize key listeners
        this.initKeyboardListeners();
        
        // Initialize mouse listeners
        this.initMouseListeners();
        
        console.log('InputManager initialized');
    },
    
    initKeyboardListeners() {
        // Key down handler
        document.addEventListener('keydown', (event) => {
            // Update key state
            this.keyboard.keys[event.code] = true;
            
            // Prevent default for game controls to avoid scrolling etc.
            if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyQ', 'KeyE', 'KeyZ', 'KeyC', 'Space'].includes(event.code)) {
                event.preventDefault();
            }
        });
        
        // Key up handler
        document.addEventListener('keyup', (event) => {
            // Update key state
            this.keyboard.keys[event.code] = false;
        });
    },
    
    initMouseListeners() {
        // Mouse move handler
        document.addEventListener('mousemove', (event) => {
            this.mouse.x = event.clientX;
            this.mouse.y = event.clientY;
        });
        
        // Mouse down handler
        document.addEventListener('mousedown', (event) => {
            if (event.button === 0) {
                this.mouse.isLeftButtonDown = true;
            } else if (event.button === 2) {
                this.mouse.isRightButtonDown = true;
            }
        });
        
        // Mouse up handler
        document.addEventListener('mouseup', (event) => {
            if (event.button === 0) {
                this.mouse.isLeftButtonDown = false;
            } else if (event.button === 2) {
                this.mouse.isRightButtonDown = false;
            }
        });
        
        // Disable context menu on right click
        document.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });
    }
};

// Export the InputManager
export default InputManager; 