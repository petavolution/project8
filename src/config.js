// Unified Game Configuration for spaceSiM04
// This config merges and modernizes settings, asset paths, and manifest support from both source projects.
const CONFIG = {
  // Asset paths
  // Unified asset and library paths
  ASSETS_PATH: 'assets/',
  DRACO_PATH: 'assets/draco/',
  LIBS_PATH: 'libs/',

  // Asset manifest support (for remote/offline assets)
  MANIFEST_PATH: 'assets/manifest.json',
  REMOTE_ASSETS_BASE: '', // Set to remote asset base URL if needed

  
  // Textures (merged, supports both flat and nested structure)
  textures: {
    path: 'assets/textures',
    skybox: 'assets/textures/skybox',
    planets: {
      earth: 'assets/textures/2k_earth_daymap.jpg',
      moon: 'assets/textures/2k_moon.jpg',
      sun: 'assets/textures/2k_sun.jpg',
      mercury: 'assets/textures/2k_mercury.jpg',
      venus: 'assets/textures/2k_venus_surface.jpg',
      mars: 'assets/textures/2k_mars.jpg',
      jupiter: 'assets/textures/2k_jupiter.jpg',
      saturn: 'assets/textures/2k_saturn.jpg',
      saturn_ring: 'assets/textures/2k_saturn_ring_alpha.png',
      uranus: 'assets/textures/2k_uranus.jpg',
      neptune: 'assets/textures/2k_neptune.jpg',
      // Extended/extra textures
      earth_clouds: 'assets/textures/Earth-clouds.png',
      // Add more as needed from merged assets
    },
    // Support for additional folders (e.g., planets/skybox)
    folders: {
      planets: 'assets/textures/planets/',
      skybox: 'assets/textures/skybox/'
    }
  },
  
  // Sounds (unified)
  sounds: {
    engineIdle: 'assets/sounds/engine_idle.mp3',
    engineBoost: 'assets/sounds/engine_boost.mp3',
    laser: 'assets/sounds/laser.mp3',
    explosion: 'assets/sounds/explosion.mp3',
    warning: 'assets/sounds/warning.mp3',
    notification: 'assets/sounds/notification.mp3',
    hyperspaceEnter: 'assets/sounds/hyperspace_enter.mp3',
    hyperspaceExit: 'assets/sounds/hyperspace_exit.mp3',
    spaceAmbience: 'assets/sounds/space_ambience.mp3'
  },

  // Models (merged)
  models: {
    path: 'assets/models',
    spacecraft: 'assets/models/xwing_axespoints.glb',
    xwing: 'assets/models/x-wing.glb',
    star_destroyer: 'assets/models/star_wars_imperial_ii_star_destroyer/star_wars_imperial_ii_star_destroyer.glb',
    asteroid: 'assets/models/asteroid.glb',
    asteroid_gltf: 'assets/models/asteroid.gltf',
    // Add more as needed from merged models
  },
  
  // Game settings (merged, extensible)
  settings: {
    spacecraftSpeed: 5,
    boostSpeed: 25,
    slowSpeed: 2.5,
    hyperSpaceSpeed: 250,
    rotationSpeed: 0.02,
    // Add more gameplay or visualization settings as needed
  },
  
  // Debug and UI settings
  debug: {
    showFPS: false,
    showCoordinates: true,
    // Add more debug toggles as needed
  },
  
  // Celestial bodies (merged, extensible)
  celestialBodies: {
    sun: {
      name: "Sun",
      radius: 10,
      position: [0, 0, 0],
      rotationSpeed: 0.001
    },
    mercury: {
      name: "Mercury",
      radius: 0.38,
      position: [20, 0, 0],
      rotationSpeed: 0.004
    },
    venus: {
      name: "Venus",
      radius: 0.95,
      position: [30, 0, 0],
      rotationSpeed: 0.002
    },
    earth: {
      name: "Earth",
      radius: 1,
      position: [40, 0, 0],
      rotationSpeed: 0.01,
      hasAtmosphere: true
    },
    moon: {
      name: "Moon",
      radius: 0.27,
      position: [3, 0, 0], // Relative to Earth
      rotationSpeed: 0.01,
      parent: "earth"
    },
    mars: {
      name: "Mars",
      radius: 0.53,
      position: [55, 0, 0],
      rotationSpeed: 0.008
    },
    jupiter: {
      name: "Jupiter",
      radius: 11.2,
      position: [75, 0, 0],
      rotationSpeed: 0.004
    },
    saturn: {
      name: "Saturn",
      radius: 9.45,
      position: [100, 0, 0],
      rotationSpeed: 0.038,
      hasRings: true,
      rings: {
        innerRadius: 11,
        outerRadius: 20
      }
    },
    uranus: {
      name: "Uranus",
      radius: 4,
      position: [120, 0, 0],
      rotationSpeed: 0.03
    },
    neptune: {
      name: "Neptune",
      radius: 3.88,
      position: [140, 0, 0],
      rotationSpeed: 0.032
    }
  }
};

// Export for both Node.js and browser
if (typeof module !== 'undefined') {
  module.exports = CONFIG;
} else if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
// End of unified config