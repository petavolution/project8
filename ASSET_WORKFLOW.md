# Unified Asset Management Workflow

This project uses a unified, config-driven asset management system for all models, textures, and sounds. All asset paths are defined in `assets/config.js` and loaded via the central `AssetManager` utility.

## Why This Matters
- **Single source of truth:** All asset paths are managed in one place (`CONFIG`).
- **Maintainability:** No hardcoded asset paths in the codebase.
- **Extensibility:** Easy to add, update, or swap assets (local/remote/manifest) without changing code.
- **Fallbacks:** Robust error handling and fallback assets for missing resources.

## How to Add or Update Assets

### 1. **Add Asset Files**
- Place new models in `assets/models/`
- Place new textures in `assets/textures/`
- Place new sounds in `assets/sounds/`

### 2. **Register Asset in `CONFIG`**
Edit `assets/config.js`:
- **Models:** Add to `CONFIG.models`
- **Textures:** Add to `CONFIG.textures` or `CONFIG.textures.planets`, etc.
- **Sounds:** Add to `CONFIG.sounds`

**Example:**
```js
models: {
  spacecraft: 'assets/models/xwing.glb',
  asteroid: 'assets/models/asteroid.glb',
  ...
},
textures: {
  planets: {
    earth: 'assets/textures/2k_earth_daymap.jpg',
    ...
  },
  skybox: {
    px: 'assets/textures/skybox/px.jpg',
    ...
  }
},
sounds: {
  engineIdle: 'assets/sounds/engine_idle.mp3',
  ...
}
```

### 3. **Reference Assets in Code**
- **Always** use the asset manager or config key, never a hardcoded path.
- Example for loading a model:
```js
const model = await assetManager.loadModel('spacecraft');
```
- Example for loading a texture:
```js
const texture = await assetManager.loadTexture('earth');
```
- Example for playing a sound:
```js
playSound('engineIdle');
```

### 4. **Fallbacks and Error Handling**
- If an asset is missing or fails to load, the asset manager will log a warning and use a fallback asset when possible.
- Always check the browser console for warnings/errors during development.

## Advanced: Asset Manifest Support
- For remote/offline asset management, update `CONFIG.MANIFEST_PATH` and provide a manifest JSON mapping asset keys to URLs.

## Best Practices
- **Never** commit hardcoded asset paths in modules.
- Update this documentation if you add new asset types or workflows.
- Add comments in code referencing this guide where asset loading occurs.

---

For questions, see the code comments in `Game.js`, `SolarSystem.js`, `Spacecraft.js`, `Environment.js`, and `AssetManager.js`, or contact the project maintainer.
