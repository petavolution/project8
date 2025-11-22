# Planetary World - Space Simulation Game

A 3D space simulation game built with Three.js that allows you to explore the solar system. This version uses local assets and libraries for offline use.

## Features

- 3D space environment with stars and planets
- Spacecraft controls with keyboard
- All planets of the solar system with realistic textures
- Earth atmosphere and Saturn's rings
- Asteroid belt between Mars and Jupiter
- Skybox with galaxy background
- Coordinate display
- Distance indicators for nearby planets
- Loading screen and welcome instructions

## Architecture

The game is built using a modular, component-based architecture:

### Core Modules
- **Game**: Main game orchestration class responsible for initializing all components
- **SceneManager**: Handles Three.js scene, camera, and renderer setup
- **Environment**: Manages skybox, stars, and asteroid fields

### Entity Modules
- **SolarSystem**: Handles all celestial bodies and their properties
- **Spacecraft**: Player spacecraft movement and interaction

### Utility Modules
- **AssetManager**: Centralized asset loading system
- **InputManager**: Keyboard and mouse input processing
- **Utils**: General utility functions

## Setup and Running Locally

1. Start a local web server:
   ```
   node server.js
   ```
2. Open your browser and navigate to http://localhost:8080

## Controls

- **W/↑**: Move forward
- **S/↓**: Move backward
- **A/**: Turn left
- **D/**: Turn right
- **Q**: Roll left
- **E**: Roll right
- **↑**: pitch up
- **↓**: pitch down

- **SHIFT**: Boost speed
- **CTRL**: Slow down
- **SPACE**: Hyperspace jump
- **C**: Toggle camera mode (free/cockpit)
- **P**: Pause game

## Local Assets

## NASA-Inspired Library Management

All core third-party libraries (e.g., Three.js, Draco, loaders, utilities) are managed locally in the `libs/` directory, inspired by the NASA module pattern.

### Usage Example
```js
import * as THREE from '../libs/three.module.js';
// import { DRACOLoader } from '../libs/draco/DRACOLoader.js';
```

**Best Practice:** Never rely on CDN or remote sources for core dependencies. Always add/update libraries in `libs/` and import them locally in your game code.

### Contributor Checklist
- [ ] Add new libraries to `libs/` and document them in `modules/libs/README.md`
- [ ] Always import libraries from local paths
- [ ] Do not use remote URLs or CDNs for core libraries

---

This version uses completely local assets:

- Three.js libraries in `./libs/`
- 3D models in `./assets/models/`
- Textures in `./assets/textures/`
- Draco decoder in `./libs/draco/decoder/`

No internet connection is required after the initial setup.

## Optimization Features

- Modular code organization for better maintainability
- Asset caching system to improve performance
- Optimized rendering with dynamic level of detail
- Efficient collision detection
- Centralized input management
- Promise-based asset loading with progress indication

## Troubleshooting

If you encounter any issues:

1. Check the browser console for errors (F12 or Ctrl+Shift+I in most browsers)
2. Ensure all paths are correct and files are in the right directories
3. Some browsers have security restrictions with local files - always use a web server

## License

This project is for educational purposes only. 