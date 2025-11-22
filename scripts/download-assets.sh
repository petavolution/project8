#!/bin/bash

# NASA Eyes on the Solar System - Download Script
# This script downloads all necessary files to replicate the NASA Eyes on the Solar System app

BASE_URL="https://eyes.nasa.gov/apps/solar-system"
DOWNLOAD_DIR="."

# Create necessary directories
mkdir -p assets/default/svg
mkdir -p assets/default/fonts

# Download main JavaScript files
echo "Downloading JavaScript files..."
curl -L -o config.js "$BASE_URL/config.js"
curl -L -o commons.js "$BASE_URL/commons.js"
curl -L -o preload.js "$BASE_URL/preload.js"
curl -L -o vendors.js "$BASE_URL/vendors.js"
curl -L -o app.js "$BASE_URL/app.js"

# Download CSS files
echo "Downloading CSS files..."
curl -L -o preload.css "$BASE_URL/preload.css"
curl -L -o vendors.css "$BASE_URL/vendors.css"
curl -L -o app.css "$BASE_URL/app.css"

# Download favicon and icon assets
echo "Downloading favicon and icon assets..."
curl -L -o apple-touch-icon.png "$BASE_URL/apple-touch-icon.png"
curl -L -o favicon-32x32.png "$BASE_URL/favicon-32x32.png"
curl -L -o favicon-194x194.png "$BASE_URL/favicon-194x194.png"
curl -L -o android-chrome-192x192.png "$BASE_URL/android-chrome-192x192.png"
curl -L -o favicon-16x16.png "$BASE_URL/favicon-16x16.png"
curl -L -o site.webmanifest "$BASE_URL/site.webmanifest"
curl -L -o safari-pinned-tab.svg "$BASE_URL/safari-pinned-tab.svg"
curl -L -o favicon.ico "$BASE_URL/favicon.ico"
curl -L -o browserconfig.xml "$BASE_URL/browserconfig.xml"
curl -L -o og_img.jpg "$BASE_URL/og_img.jpg"

# Download preloaded assets
echo "Downloading preloaded assets..."
curl -L -o assets/default/svg/nasa_logo.svg "$BASE_URL/assets/default/svg/nasa_logo.svg"
curl -L -o assets/default/fonts/Metropolis-SemiBold.woff "$BASE_URL/assets/default/fonts/Metropolis-SemiBold.woff"

echo "Basic assets downloaded. Now analyzing JavaScript files for additional required resources..." 