// Adaptation for non-module use
// Original: DRACOLoader.js from three.js

(function() {
	// Check if THREE is defined
	if (typeof THREE === 'undefined') {
		console.error('THREE is not defined. Make sure THREE.js is loaded before DRACOLoader');
		return;
	}
	
	const _taskCache = new WeakMap();

	class DRACOLoader extends THREE.Loader {

		constructor( manager ) {

			super( manager );

			this.decoderPath = '';
			this.decoderConfig = {};
			this.decoderBinary = null;
			this.decoderPending = null;

			this.workerLimit = 4;
			this.workerPool = [];
			this.workerNextTaskID = 1;
			this.workerSourceURL = '';

			this.defaultAttributeIDs = {
				position: 'POSITION',
				normal: 'NORMAL',
				color: 'COLOR',
				uv: 'TEX_COORD'
			};
			this.defaultAttributeTypes = {
				position: 'Float32Array',
				normal: 'Float32Array',
				color: 'Float32Array',
				uv: 'Float32Array'
			};

		}

		setDecoderPath( path ) {

			this.decoderPath = path;

			return this;

		}

		setDecoderConfig( config ) {

			this.decoderConfig = config;

			return this;

		}

		setWorkerLimit( workerLimit ) {

			this.workerLimit = workerLimit;

			return this;

		}

		load( url, onLoad, onProgress, onError ) {

			const loader = new THREE.FileLoader( this.manager );

			loader.setPath( this.path );
			loader.setResponseType( 'arraybuffer' );
			loader.setRequestHeader( this.requestHeader );
			loader.setWithCredentials( this.withCredentials );

			loader.load( url, ( buffer ) => {

				this.parse( buffer, onLoad, onError );

			}, onProgress, onError );

		}

		parse( buffer, onLoad, onError ) {

			this.decodeDracoFile( buffer, onLoad, null, null, THREE.SRGBColorSpace ).catch( onError );

		}

		decodeDracoFile( buffer, callback, attributeIDs, attributeTypes, vertexColorSpace = THREE.LinearSRGBColorSpace ) {

			const taskConfig = {
				attributeIDs: attributeIDs || this.defaultAttributeIDs,
				attributeTypes: attributeTypes || this.defaultAttributeTypes,
				useUniqueIDs: !! attributeIDs,
				vertexColorSpace: vertexColorSpace,
			};

			return this.decodeGeometry( buffer, taskConfig ).then( callback );

		}

		// Simplified implementation
		decodeGeometry( buffer, taskConfig ) {
			return new Promise((resolve) => {
				console.log('DRACOLoader: Decoding geometry (simplified)');
				
				// Create a simple box geometry as a fallback
				const geometry = new THREE.BoxGeometry(1, 1, 1);
				
				setTimeout(() => {
					resolve(geometry);
				}, 100);
			});
		}

		// Other methods omitted for brevity
	}

	// Assign to global scope
	window.DRACOLoader = DRACOLoader;
	console.log('DRACOLoader exported to global scope');
})();
