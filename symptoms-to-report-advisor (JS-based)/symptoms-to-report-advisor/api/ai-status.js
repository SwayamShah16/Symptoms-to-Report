/* Vercel serverless function: GET /api/ai-status. Tells the page whether the
   optional AI wording is configured, so the checkbox only appears when it works. */
'use strict';
const ai = require('../backend/ai-core.js');

module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json(ai.statusBody());
};
