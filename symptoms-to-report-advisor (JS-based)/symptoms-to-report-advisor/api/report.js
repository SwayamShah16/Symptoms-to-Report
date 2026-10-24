/* Vercel serverless function: POST /api/report  (OPTIONAL AI wording).
   Set GEMINI_API_KEY (free) or ANTHROPIC_API_KEY in the Vercel project's
   Environment Variables. The key is never sent to the browser. */
'use strict';
const ai = require('../backend/ai-core.js');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (err) { body = null; } }
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const result = await ai.handleReportRequest(body, forwarded || (req.socket && req.socket.remoteAddress));
  res.status(result.status).json(result.body);
};
