// Simple HTTP server
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wasm': 'application/wasm',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.bin': 'application/octet-stream',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.wav': 'audio/wav',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf'
};

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.url}`);
  
  // Parse URL
  const parsedUrl = url.parse(req.url);
  
  // Extract path from URL
  let pathname = path.join(__dirname, parsedUrl.pathname);
  
  // If path ends with '/', append 'index.html'
  if (pathname.endsWith('/')) {
    pathname = path.join(pathname, 'index.html');
  }
  
  // Get the file extension
  const ext = path.parse(pathname).ext;
  
  // Check if file exists
  fs.stat(pathname, (err, stats) => {
    if (err) {
      // If there's an error or file doesn't exist
      console.error(`File not found: ${pathname}`);
      // Fall back to index.html for SPA routing
      fs.readFile('./index.html', (error, content) => {
        if (error) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('500 Internal Server Error');
          return;
        }
        res.writeHead(200, { 
          'Content-Type': 'text/html',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end(content, 'utf-8');
      });
      return;
    }
    
    // If it's a directory, try to serve index.html
    if (stats.isDirectory()) {
      pathname = path.join(pathname, 'index.html');
    }
    
    // Read file
    fs.readFile(pathname, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
      }
      
      // Set content type based on file extension
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      
      // Add CORS headers to allow loading from any origin
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      
      // Serve file data
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`To view the space simulator, open your browser and navigate to http://localhost:${PORT}/`);
}); 