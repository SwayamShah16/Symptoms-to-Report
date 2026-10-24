/* ============================================================================
   backend/server.js - OPTIONAL local server for Symptoms to Report Advisor

   The core app does NOT need this file. Use it only if you want AI-improved
   wording. It serves the website AND keeps your API key on the server (an
   environment variable), so the key never appears in browser code.

   Requires Node 18 or newer (uses built-in fetch). No npm install needed.

   FREE option (Gemini key from https://aistudio.google.com/app/apikey):
       macOS / Linux:      GEMINI_API_KEY=your-key node backend/server.js
       Windows PowerShell: $env:GEMINI_API_KEY="your-key"; node backend/server.js
   Paid option (Anthropic):
       ANTHROPIC_API_KEY=your-key node backend/server.js
   Then open http://localhost:3000

   Privacy choices made here:
   - Listens on 127.0.0.1 only (not reachable from other computers).
   - Forwards only the known answer fields, trimmed to a safe length.
   - Never logs request bodies or responses (they contain health information).
   ============================================================================ */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const ai = require('./ai-core.js');

const PORT = Number(process.env.PORT) || 3000;
const WEB_ROOT = path.join(__dirname, '..');

// Only these files can ever be served (a whitelist avoids path traversal).
const STATIC_FILES = {
  '/': 'index.html', '/index.html': 'index.html', '/style.css': 'style.css',
  '/rules.js': 'rules.js', '/assistant.js': 'assistant.js', '/script.js': 'script.js'
};
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}

function serveFile(res, fileName) {
  fs.readFile(path.join(WEB_ROOT, fileName), function (err, data) {
    if (err) return sendJson(res, 404, { error: 'Not found' });
    res.writeHead(200, { 'Content-Type': MIME[path.extname(fileName)] || 'text/plain' });
    res.end(data);
  });
}

function readBody(req, limitBytes) {
  return new Promise(function (resolve, reject) {
    let size = 0;
    const chunks = [];
    req.on('data', function (chunk) {
      size += chunk.length;
      if (size > limitBytes) { reject(new Error('Body too large')); req.destroy(); return; }
      chunks.push(chunk);
    });
    req.on('end', function () { resolve(Buffer.concat(chunks).toString('utf8')); });
    req.on('error', reject);
  });
}

const server = http.createServer(async function (req, res) {
  try {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    if (req.method === 'GET' && pathname === '/api/ai-status') return sendJson(res, 200, ai.statusBody());
    if (req.method === 'POST' && pathname === '/api/report') {
      let body = null;
      try { body = JSON.parse(await readBody(req, 20000)); } catch (err) { return sendJson(res, 400, { error: 'Invalid request.' }); }
      const result = await ai.handleReportRequest(body, req.socket.remoteAddress);
      return sendJson(res, result.status, result.body);
    }
    if (req.method === 'GET' && STATIC_FILES[pathname]) return serveFile(res, STATIC_FILES[pathname]);
    sendJson(res, 404, { error: 'Not found' });
  } catch (err) {
    console.error('Server error:', err.message);
    sendJson(res, 500, { error: 'Server error' });
  }
});

server.listen(PORT, '127.0.0.1', function () {
  const status = ai.statusBody();
  console.log('Symptoms to Report Advisor running at http://localhost:' + PORT);
  console.log(status.enabled ? 'AI wording: ENABLED using ' + status.provider + ' (optional checkbox appears in the form).'
    : 'AI wording: not configured (the app works fully without it, and Smart Fill still works).');
});
