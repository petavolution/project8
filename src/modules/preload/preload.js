// Preloader module adapted from NASA preload.js
// Preloads game assets for smoother startup

// Preloads all assets listed in asset_manifest.json
export async function preloadAssetsFromManifest(manifestUrl, onProgress, onComplete) {
    const res = await fetch(manifestUrl);
    const manifest = await res.json();
    const assetList = [].concat(manifest.textures || [], manifest.models || [], manifest.sounds || []);
    let loaded = 0;
    if (assetList.length === 0) {
        if (onComplete) onComplete();
        return;
    }
    assetList.forEach(asset => {
        // Only preload images for demonstration; extend for models/sounds as needed
        if (asset.endsWith('.png') || asset.endsWith('.jpg') || asset.endsWith('.jpeg') || asset.endsWith('.gif')) {
            const img = new window.Image();
            img.onload = () => {
                loaded++;
                if (onProgress) onProgress(loaded / assetList.length);
                if (loaded === assetList.length && onComplete) onComplete();
            };
            img.onerror = img.onload;
            img.src = asset;
        } else {
            // For non-image assets, simulate loading
            setTimeout(() => {
                loaded++;
                if (onProgress) onProgress(loaded / assetList.length);
                if (loaded === assetList.length && onComplete) onComplete();
            }, 100);
        }
    });
}

