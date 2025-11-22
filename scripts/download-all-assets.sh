#!/bin/bash

# NASA Eyes on the Solar System - Comprehensive Download Script
# This script downloads all necessary files including static and dynamic assets

# Base URLs
BASE_URL="https://eyes.nasa.gov/apps/solar-system"
STATIC_ASSETS_URL="https://eyes.nasa.gov/assets/static"
DYNAMIC_ASSETS_URL="https://eyes.nasa.gov/assets/dynamic"
ANIMDATA_URL="https://eyes.nasa.gov/server/spice"

# Create directories for assets
mkdir -p assets/static
mkdir -p assets/dynamic
mkdir -p server/spice

echo "Downloading initial asset manifest..."
# We'll use app.js to find references to asset manifests
grep -o '"[^"]*manifest[^"]*\.json"' app.js | tr -d '"' > asset_manifests.txt

# Function to download assets based on manifest
download_manifest_assets() {
    local manifest_url=$1
    local output_dir=$2
    local manifest_name=$(basename $manifest_url)
    
    echo "Downloading manifest: $manifest_name"
    curl -s -L -o "$output_dir/$manifest_name" "$manifest_url"
    
    # Extract file paths from manifest and download them
    if [ -f "$output_dir/$manifest_name" ]; then
        grep -o '"[^"]*\.\(gltf\|glb\|jpg\|png\|json\|bin\|ktx2\|dds\)"' "$output_dir/$manifest_name" | tr -d '"' | while read asset; do
            # Create directory structure if needed
            asset_dir=$(dirname "$output_dir/$asset")
            mkdir -p "$asset_dir"
            
            # Download the asset
            echo "Downloading: $asset"
            curl -s -L -o "$output_dir/$asset" "$manifest_url/../$asset"
        done
    fi
}

# Download static and dynamic assets
echo "Attempting to identify and download asset manifests..."

# Static assets - try common paths
mkdir -p assets/static/solar-system
curl -s -L -o assets/static/solar-system/manifest.json "$STATIC_ASSETS_URL/solar-system/manifest.json"

# Dynamic assets - try common paths
mkdir -p assets/dynamic/solar-system
curl -s -L -o assets/dynamic/solar-system/manifest.json "$DYNAMIC_ASSETS_URL/solar-system/manifest.json"

# Download SPICE data
echo "Downloading SPICE data..."
mkdir -p server/spice/solar-system
curl -s -L -o server/spice/solar-system/manifest.json "$ANIMDATA_URL/solar-system/manifest.json"

# Try to find any textures, models, and other binary assets referenced in JS files
echo "Extracting asset references from JavaScript files..."
grep -o '"[^"]*\.\(gltf\|glb\|jpg\|png\|json\|bin\|ktx2\|dds\)"' app.js vendors.js commons.js > asset_references.txt

# Download textures from static assets
echo "Downloading texture assets..."
mkdir -p assets/static/textures
curl -s -L -o assets/static/textures/manifest.json "$STATIC_ASSETS_URL/textures/manifest.json"

# Download 3D models 
echo "Downloading 3D model assets..."
mkdir -p assets/static/models
curl -s -L -o assets/static/models/manifest.json "$STATIC_ASSETS_URL/models/manifest.json"

# Use wget to mirror the necessary directories recursively
echo "Using wget to recursively download required asset directories..."

# Download static assets
wget -q -r -np -nH --cut-dirs=3 -P assets/static "$STATIC_ASSETS_URL/solar-system/" -A "*.json,*.jpg,*.png,*.glb,*.gltf,*.bin,*.ktx2,*.dds" -R "index.html*"

# Download dynamic assets
wget -q -r -np -nH --cut-dirs=3 -P assets/dynamic "$DYNAMIC_ASSETS_URL/solar-system/" -A "*.json,*.jpg,*.png,*.glb,*.gltf,*.bin,*.ktx2,*.dds" -R "index.html*"

# Download SPICE data
wget -q -r -np -nH --cut-dirs=3 -P server/spice "$ANIMDATA_URL/solar-system/" -A "*.json,*.bsp,*.tsc,*.tpc,*.tf,*.bin" -R "index.html*"

echo "Creating a local copy of the config.js file with updated paths..."
cat > config.local.js << EOF
config = {
	staticAssetsUrl: './assets/static',
	dynamicAssetsUrl: './assets/dynamic',
	animdataUrl: './server/spice'
}
EOF

echo "All assets downloaded. You may need to update the index.html to use config.local.js instead of config.js" 