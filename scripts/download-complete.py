#!/usr/bin/env python3

import os
import re
import json
import requests
import concurrent.futures
import shutil
import time
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup

# Base URLs
BASE_URL = "https://eyes.nasa.gov/apps/solar-system/"
STATIC_ASSETS_URL = "https://eyes.nasa.gov/assets/static/"
DYNAMIC_ASSETS_URL = "https://eyes.nasa.gov/assets/dynamic/"
ANIMDATA_URL = "https://eyes.nasa.gov/server/spice/"

OUTPUT_DIR = "."

# For progress tracking
total_files = 0
downloaded_files = 0
download_errors = []

# Ensure all necessary directories exist
def ensure_dir(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

# Update progress display
def update_progress():
    if total_files > 0:
        percentage = (downloaded_files / total_files) * 100
        print(f"\rProgress: {downloaded_files}/{total_files} files ({percentage:.1f}%) - {len(download_errors)} errors", end="")

# Download a file, creating parent directories if needed
def download_file(url, output_path):
    global downloaded_files, download_errors
    
    # Create parent directories if they don't exist
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    try:
        response = requests.get(url, stream=True, timeout=30)
        if response.status_code == 200:
            with open(output_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            downloaded_files += 1
            update_progress()
            return True
        else:
            print(f"\nFailed to download {url}: Status code {response.status_code}")
            download_errors.append((url, output_path, f"Status code {response.status_code}"))
            return False
    except requests.exceptions.RequestException as e:
        print(f"\nError downloading {url}: {e}")
        download_errors.append((url, output_path, str(e)))
        return False

# Extract asset URLs from JavaScript and CSS files
def extract_asset_urls(file_path, base_url):
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return []

    # Find all URL patterns in the file
    urls = []
    
    # Pattern for quoted URLs
    quoted_urls = re.findall(r'["\']((?:/|https?:)(?:[^"\'\\]|\\.)*/[^"\']*\.[a-zA-Z0-9]+)["\']', content)
    urls.extend(quoted_urls)
    
    # Pattern for non-quoted URLs in CSS
    if file_path.endswith('.css'):
        css_urls = re.findall(r'url\(([^)]+)\)', content)
        # Clean up the CSS URLs (remove quotes if present)
        css_urls = [url.strip('"\'') for url in css_urls]
        urls.extend(css_urls)
    
    # Clean and normalize URLs
    result = []
    for url in urls:
        if url.startswith('/'):
            # Convert absolute path to full URL
            full_url = urljoin("https://eyes.nasa.gov", url)
            result.append(full_url)
        elif url.startswith('http'):
            # Already a full URL
            result.append(url)
        else:
            # Relative URL - join with base URL
            full_url = urljoin(base_url, url)
            result.append(full_url)
    
    return result

# Process and download assets from an extracted URL
def process_asset_url(url):
    # Skip data URLs
    if url.startswith('data:'):
        return None
    
    # Clean URL - remove query strings
    clean_url = url.split('?')[0]
    parsed_url = urlparse(clean_url)
    
    # Skip if not from nasa.gov
    if not parsed_url.netloc.endswith('nasa.gov'):
        return None
    
    # Get relative path from URL
    path = parsed_url.path
    if path.startswith('/'):
        path = path[1:]
    
    # Determine output path
    if parsed_url.netloc == 'eyes.nasa.gov':
        if path.startswith('assets/'):
            output_path = os.path.join(OUTPUT_DIR, path)
        elif path.startswith('server/'):
            output_path = os.path.join(OUTPUT_DIR, path)
        else:
            output_path = os.path.join(OUTPUT_DIR, path)
    else:
        # For assets from other nasa.gov domains, store under external/
        output_path = os.path.join(OUTPUT_DIR, 'external', parsed_url.netloc, path)
    
    return {'url': clean_url, 'output_path': output_path}

# Verify downloaded files
def verify_downloads():
    print("\n\nVerifying downloaded files...")
    failed_files = []
    
    for url, output_path, error in download_errors:
        print(f"  - Failed: {output_path} (Error: {error})")
        
    # Check for any missing essential files
    essential_files = [
        "index.html", 
        "config.js", 
        "commons.js", 
        "preload.js", 
        "vendors.js", 
        "app.js",
        "preload.css", 
        "vendors.css", 
        "app.css",
        "config.local.js",
        "assets/default/svg/nasa_logo.svg"
    ]
    
    for file in essential_files:
        path = os.path.join(OUTPUT_DIR, file)
        if not os.path.exists(path):
            print(f"  - Missing essential file: {file}")
            failed_files.append(file)
    
    if failed_files:
        print(f"\nWarning: {len(failed_files)} essential files are missing.")
        print("The application might not work properly.")
    else:
        print("\nAll essential files have been downloaded successfully.")

# Main function to download all assets
def download_all_assets():
    global total_files, downloaded_files, download_errors
    
    start_time = time.time()
    
    ensure_dir(os.path.join(OUTPUT_DIR, "assets/static"))
    ensure_dir(os.path.join(OUTPUT_DIR, "assets/dynamic"))
    ensure_dir(os.path.join(OUTPUT_DIR, "server/spice"))
    ensure_dir(os.path.join(OUTPUT_DIR, "assets/default/svg"))
    ensure_dir(os.path.join(OUTPUT_DIR, "assets/default/fonts"))
    ensure_dir(os.path.join(OUTPUT_DIR, "external"))
    
    # Download main HTML, JavaScript, and CSS files
    main_files = [
        (f"{BASE_URL}", "index.html"),
        (f"{BASE_URL}config.js", "config.js"),
        (f"{BASE_URL}commons.js", "commons.js"),
        (f"{BASE_URL}preload.js", "preload.js"),
        (f"{BASE_URL}vendors.js", "vendors.js"),
        (f"{BASE_URL}app.js", "app.js"),
        (f"{BASE_URL}preload.css", "preload.css"),
        (f"{BASE_URL}vendors.css", "vendors.css"),
        (f"{BASE_URL}app.css", "app.css"),
    ]
    
    total_files += len(main_files)
    print("Downloading main files...")
    
    for url, output_file in main_files:
        download_file(url, os.path.join(OUTPUT_DIR, output_file))
    
    # Download favicon and other static assets
    favicon_files = [
        (f"{BASE_URL}apple-touch-icon.png", "apple-touch-icon.png"),
        (f"{BASE_URL}favicon-32x32.png", "favicon-32x32.png"),
        (f"{BASE_URL}favicon-194x194.png", "favicon-194x194.png"),
        (f"{BASE_URL}android-chrome-192x192.png", "android-chrome-192x192.png"),
        (f"{BASE_URL}favicon-16x16.png", "favicon-16x16.png"),
        (f"{BASE_URL}site.webmanifest", "site.webmanifest"),
        (f"{BASE_URL}safari-pinned-tab.svg", "safari-pinned-tab.svg"),
        (f"{BASE_URL}favicon.ico", "favicon.ico"),
        (f"{BASE_URL}browserconfig.xml", "browserconfig.xml"),
        (f"{BASE_URL}og_img.jpg", "og_img.jpg"),
    ]
    
    total_files += len(favicon_files)
    print("\nDownloading favicon files...")
    
    for url, output_file in favicon_files:
        download_file(url, os.path.join(OUTPUT_DIR, output_file))
    
    # Download preloaded assets
    preloaded_assets = [
        (f"{BASE_URL}assets/default/svg/nasa_logo.svg", "assets/default/svg/nasa_logo.svg"),
        (f"{BASE_URL}assets/default/fonts/Metropolis-SemiBold.woff", "assets/default/fonts/Metropolis-SemiBold.woff"),
    ]
    
    total_files += len(preloaded_assets)
    print("\nDownloading preloaded assets...")
    
    for url, output_file in preloaded_assets:
        download_file(url, os.path.join(OUTPUT_DIR, output_file))
    
    # Extract and download additional assets from JavaScript and CSS files
    js_css_files = [
        (os.path.join(OUTPUT_DIR, "app.js"), BASE_URL),
        (os.path.join(OUTPUT_DIR, "vendors.js"), BASE_URL),
        (os.path.join(OUTPUT_DIR, "commons.js"), BASE_URL),
        (os.path.join(OUTPUT_DIR, "preload.js"), BASE_URL),
        (os.path.join(OUTPUT_DIR, "app.css"), BASE_URL),
        (os.path.join(OUTPUT_DIR, "vendors.css"), BASE_URL),
        (os.path.join(OUTPUT_DIR, "preload.css"), BASE_URL),
    ]
    
    print("\nExtracted asset URLs from JavaScript and CSS files...")
    
    all_asset_urls = []
    for file_path, base_url in js_css_files:
        urls = extract_asset_urls(file_path, base_url)
        all_asset_urls.extend(urls)
    
    # Process and filter assets
    assets_to_download = []
    for url in all_asset_urls:
        asset_info = process_asset_url(url)
        if asset_info:
            assets_to_download.append(asset_info)
    
    # Remove duplicates (same URL)
    unique_assets = {}
    for asset in assets_to_download:
        unique_assets[asset['url']] = asset['output_path']
    
    total_files += len(unique_assets)
    print(f"\nFound {len(unique_assets)} unique assets to download")
    
    # Download assets in parallel
    download_tasks = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        for url, output_path in unique_assets.items():
            download_tasks.append(executor.submit(download_file, url, output_path))
        
        # Wait for all downloads to complete
        for future in concurrent.futures.as_completed(download_tasks):
            try:
                result = future.result()
            except Exception as e:
                print(f"\nError during download: {e}")
    
    # Create a local config file with modified paths
    create_local_config()
    
    elapsed_time = time.time() - start_time
    print(f"\n\nDownload complete!")
    print(f"Time elapsed: {elapsed_time:.2f} seconds")
    print(f"Files downloaded: {downloaded_files}/{total_files}")
    print(f"Errors: {len(download_errors)}")
    
    # Verify that all critical files were downloaded
    verify_downloads()

def create_local_config():
    """Create a local config file pointing to local assets"""
    config_content = """config = {
	staticAssetsUrl: './assets/static',
	dynamicAssetsUrl: './assets/dynamic',
	animdataUrl: './server/spice'
}
"""
    with open(os.path.join(OUTPUT_DIR, "config.local.js"), 'w') as f:
        f.write(config_content)

if __name__ == "__main__":
    try:
        download_all_assets()
    except KeyboardInterrupt:
        print("\n\nDownload cancelled by user.")
        print(f"Files downloaded: {downloaded_files}/{total_files}")
        print(f"Errors: {len(download_errors)}")
        # Still verify what we have so far
        verify_downloads() 