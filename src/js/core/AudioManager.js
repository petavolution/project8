/**
 * AudioManager.js - Handles sound effects and music
 */

class AudioManager {
    /**
     * Unified AudioManager: robust Web Audio API context/master gain/volume/deferred logic, async loading, Map-based caching, music support, fallback, clear API, error handling
     */
    constructor() {
        // Audio context and settings
        this.context = null;
        this.masterGain = null;
        this.initialized = false;
        this.enabled = true;
        this.volume = 0.5;
        // Sound and music storage
        this.soundBuffers = new Map();
        this.activeSounds = new Set();
        this.music = {};
        this.currentMusic = null;
        // Deferred sound requests
        this.deferredSounds = [];
        // Base path for audio files
        this.basePath = 'assets/audio/';
        this.fileExtension = '.mp3';
        console.log('Unified AudioManager created');
    }

    /**
     * Initialize the audio context when first user interaction occurs
     */
    async init() {
        if (this.initialized) return Promise.resolve();
        return new Promise((resolve) => {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (!AudioContext) {
                    console.warn('AudioContext not supported in this browser');
                    this._setupNoAudioFallback();
                    this.initialized = true;
                    resolve();
                    return;
                }
                this.context = new AudioContext();
                this.masterGain = this.context.createGain();
                this.masterGain.gain.value = this.volume;
                this.masterGain.connect(this.context.destination);
                this._processDeferredSounds();
                this.initialized = true;
                console.log('AudioManager initialized');
                resolve();
            } catch (error) {
                console.error('Error initializing audio:', error);
                this._setupNoAudioFallback();
                this.initialized = true;
                resolve();
            }
        });
    }

    _setupNoAudioFallback() {
        this.context = null;
        this.masterGain = null;
        this.enabled = false;
    }

    /**
     * Set global volume (0.0 - 1.0)
     */
    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        if (this.masterGain) this.masterGain.gain.value = this.volume;
    }

    /**
     * Load a sound file
     * @param {string} id - Sound identifier
     * @param {string} url - URL of the sound file
     */
    loadSound(id, url) {
        if (!this.context) {
            this.deferredSounds.push({ id, url });
            return;
        }
        if (this.soundBuffers.has(id)) return;
        fetch(url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => this.context.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                this.soundBuffers.set(id, audioBuffer);
                console.log(`Sound loaded: ${id}`);
            })
            .catch(error => {
                console.warn(`Failed to load sound ${id}:`, error);
            });
    }

    /**
     * Load and play music
     */
    loadMusic(id, url) {
        this.music[id] = url;
    }
    playMusic(id, loop = true) {
        if (!this.context || !this.music[id]) return;
        if (this.currentMusic) this.stopMusic();
        const audio = new Audio(this.music[id]);
        audio.loop = loop;
        audio.volume = this.volume;
        audio.play();
        this.currentMusic = audio;
    }
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic = null;
        }
    }

    /**
     * Play a loaded sound
     */
    playSound(id, options = {}) {
        if (!this.context || !this.soundBuffers.has(id)) return;
        const source = this.context.createBufferSource();
        source.buffer = this.soundBuffers.get(id);
        const gainNode = this.context.createGain();
        gainNode.gain.value = (options.volume !== undefined) ? options.volume : 1.0;
        source.connect(gainNode).connect(this.masterGain);
        source.start(0);
        this.activeSounds.add(source);
        source.onended = () => this.activeSounds.delete(source);
        return source;
    }

    /**
     * Stop all currently playing sounds
     */
    stopAllSounds() {
        for (const source of this.activeSounds) {
            try { source.stop(); } catch (e) {}
        }
        this.activeSounds.clear();
    }

    /**
     * Process deferred sound requests (called after init)
     */
    _processDeferredSounds() {
        for (const req of this.deferredSounds) {
            this.loadSound(req.id, req.url);
        }
        this.deferredSounds = [];
    }

    /**
     * Mute/unmute all audio
     */
    mute() { this.setVolume(0); }
    unmute() { this.setVolume(0.5); }
}

// Export for use in other modules
window.AudioManager = AudioManager;
    constructor() {
        // Create audio context
        this.context = null;
        this.soundBuffers = new Map();
        this.activeSounds = new Set();
        this.enabled = true;
        
        console.log('AudioManager initialized');
    }
    
    /**
     * Initialize the audio system
     * @returns {Promise} Resolves when audio is initialized
     */
    async init() {
        return new Promise((resolve) => {
            try {
                // Create audio context if supported
                if (window.AudioContext || window.webkitAudioContext) {
                    this.context = new (window.AudioContext || window.webkitAudioContext)();
                    console.log('Audio context created');
                } else {
                    console.warn('Web Audio API not supported');
                }
            } catch (error) {
                console.error('Error initializing audio:', error);
            }
            
            resolve();
        });
    }
    
    /**
     * Load a sound file
     * @param {string} id - Sound identifier
     * @param {string} url - URL of the sound file
     */
    loadSound(id, url) {
        if (!this.context) return;
        
        // Skip if already loaded
        if (this.soundBuffers.has(id)) return;
        
        fetch(url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => this.context.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                this.soundBuffers.set(id, audioBuffer);
                console.log(`Sound loaded: ${id}`);
            })
            .catch(error => {
                console.warn(`Failed to load sound ${id}:`, error);
            });
    }
    
    /**
     * Play a sound
     * @param {string} id - Sound identifier
     * @param {Object} options - Playback options
     * @returns {Object} Sound instance
     */
    playSound(id, options = {}) {
        if (!this.context || !this.enabled) return null;
        
        // Get buffer
        const buffer = this.soundBuffers.get(id);
        if (!buffer) {
            console.warn(`Sound not loaded: ${id}`);
            return null;
        }
        
        // Create source
        const source = this.context.createBufferSource();
        source.buffer = buffer;
        
        // Create gain node for volume
        const gainNode = this.context.createGain();
        gainNode.gain.value = options.volume || 1;
        
        // Connect nodes
        source.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        // Start playback
        source.start(0);
        
        // Track active sounds
        const sound = { source, gainNode, id };
        this.activeSounds.add(sound);
        
        // Remove from active sounds when finished
        source.onended = () => {
            this.activeSounds.delete(sound);
        };
        
        return sound;
    }
    
    /**
     * Stop a specific sound
     * @param {Object} sound - Sound instance to stop
     */
    stopSound(sound) {
        if (!sound || !sound.source) return;
        
        try {
            sound.source.stop();
        } catch (error) {
            // Ignore errors from already stopped sounds
        }
        
        this.activeSounds.delete(sound);
    }
    
    /**
     * Stop all sounds
     */
    stopAll() {
        this.activeSounds.forEach(sound => {
            try {
                sound.source.stop();
            } catch (error) {
                // Ignore errors
            }
        });
        
        this.activeSounds.clear();
    }
    
    /**
     * Enable or disable all audio
     * @param {boolean} enabled - Whether audio should be enabled
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        
        if (!enabled) {
            this.stopAll();
        }
    }
}

// Export for use in other modules
window.AudioManager = AudioManager; 