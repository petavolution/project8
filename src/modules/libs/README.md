# Library Management (NASA-inspired)

This game module uses a local, version-controlled `libs/` directory for all core third-party libraries, inspired by the NASA module.

## Benefits
- Ensures reproducibility and offline development
- Makes upgrades and debugging easier
- Keeps third-party code separate from application logic

## Typical Libraries
- Three.js (`libs/three.module.js`)
- Draco (`libs/draco/`)
- 3D loaders (GLTFLoader, OBJLoader, etc.)
- Utility/UI libraries (dat.GUI, stats.js, etc.)

## Usage
Import libraries from the local `libs/` directory in your game code:
```js
import * as THREE from '../libs/three.module.js';
// import { DRACOLoader } from '../libs/draco/DRACOLoader.js';
```

All contributors should add or update libraries in `libs/` and never rely on remote CDNs for core dependencies.
