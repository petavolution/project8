// Adaptation for non-module use
// Original: https://github.com/mrdoob/three.js/blob/dev/examples/jsm/loaders/GLTFLoader.js

(function() {
	// Dependencies check
	if (typeof THREE === 'undefined') {
		console.error('THREE is not defined. Make sure THREE.js is loaded before GLTFLoader');
		return;
	}
	
	if (typeof DRACOLoader === 'undefined') {
		console.warn('DRACOLoader is not defined. DRACO compressed models will not be supported');
	}
	
	// GLTFLoader class definition
	const GLTFLoader = function ( manager ) {

		THREE.Loader.call( this, manager );
		
		this.dracoLoader = null;
		this.ktx2Loader = null;
		this.meshoptDecoder = null;
		
		this.pluginCallbacks = [];
		
		this.register( function ( parser ) {
			return new GLTFMaterialsClearcoatExtension( parser );
		} );
		
		this.register( function ( parser ) {
			return new GLTFTextureBasisUExtension( parser );
		} );
		
		this.register( function ( parser ) {
			return new GLTFTextureWebPExtension( parser );
		} );
		
		this.register( function ( parser ) {
			return new GLTFMaterialsSheenExtension( parser );
		} );
		
		this.register( function ( parser ) {
			return new GLTFMaterialsTransmissionExtension( parser );
		} );
		
		this.register( function ( parser ) {
			return new GLTFMaterialsVolumeExtension( parser );
		} );
		
		this.register( function ( parser ) {
			return new GLTFMaterialsIorExtension( parser );
		} );
		
		this.register( function ( parser ) {
			return new GLTFMaterialsEmissiveStrengthExtension( parser );
		} );
		
		this.register( function ( parser ) {
			return new GLTFMaterialsSpecularExtension( parser );
		} );
		
		this.register( function ( parser ) {
			return new GLTFMaterialsAnisotropyExtension( parser );
		} );
		
		this.register( function ( parser ) {
			return new GLTFLightsExtension( parser );
		} );
		
		this.register( function ( parser ) {
			return new GLTFMeshoptCompression( parser );
		} );
		
		this.register( function ( parser ) {
			return new GLTFMeshGpuInstancing( parser );
		} );
	};

	// Inherit from THREE.Loader
	GLTFLoader.prototype = Object.assign( Object.create( THREE.Loader.prototype ), {
		constructor: GLTFLoader,
		
		load: function ( url, onLoad, onProgress, onError ) {
			// Implementation here - shortened for brevity
			console.log("GLTFLoader load called for: " + url);
			
			const scope = this;
			
			let resourcePath;
			
			if ( this.resourcePath !== '' ) {
				resourcePath = this.resourcePath;
			} else if ( this.path !== '' ) {
				resourcePath = this.path;
			} else {
				resourcePath = THREE.LoaderUtils.extractUrlBase( url );
			}
			
			// Load model
			scope.manager.itemStart( url );
			
			const _onError = function ( e ) {
				if ( onError ) {
					onError( e );
				} else {
					console.error( e );
				}
				
				scope.manager.itemError( url );
				scope.manager.itemEnd( url );
			};
			
			const loader = new THREE.FileLoader( scope.manager );
			
			loader.setPath( scope.path );
			loader.setResponseType( 'arraybuffer' );
			loader.setRequestHeader( scope.requestHeader );
			loader.setWithCredentials( scope.withCredentials );
			
			loader.load( url, function ( data ) {
				// Process the loaded data here
				console.log("GLTFLoader data loaded, processing...");
				
				try {
					scope.parse( data, resourcePath, function ( gltf ) {
						onLoad( gltf );
						scope.manager.itemEnd( url );
					}, _onError );
				} catch ( e ) {
					_onError( e );
				}
			}, onProgress, _onError );
		},
		
		parse: function ( data, path, onLoad, onError ) {
			// Implementation here - shortened for brevity
			console.log("GLTFLoader parse called");
			
			// Simplified implementation
			setTimeout(function() {
				// Create a simple mesh as placeholder
				const geometry = new THREE.BoxGeometry(1, 1, 1);
				const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
				const mesh = new THREE.Mesh(geometry, material);
				
				// Create a simple scene structure similar to GLTF
				const result = {
					scene: new THREE.Scene(),
					scenes: [new THREE.Scene()],
					animations: [],
					cameras: [],
					asset: { version: '2.0' }
				};
				
				result.scene.add(mesh);
				
				onLoad(result);
			}, 100);
		},
		
		// Other methods omitted for brevity
	});

	// Assign to global scope
	window.GLTFLoader = GLTFLoader;
	console.log("GLTFLoader exported to global scope");
})();
