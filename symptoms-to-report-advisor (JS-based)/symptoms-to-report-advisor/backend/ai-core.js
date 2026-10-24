/* ============================================================================
   backend/ai-core.js - shared logic for the OPTIONAL AI wording feature.
   Used by backend/server.js (run on your computer) and api/*.js (free hosting
   on Vercel). The core app never needs this file.

   Two providers are supported. API keys come from environment variables only.
     - Gemini (free key from Google AI Studio, no card needed):  GEMINI_API_KEY
     - Anthropic (paid key):                                      ANTHROPIC_API_KEY
   Optional: AI_PROVIDER=gemini|anthropic, GEMINI_MODEL, AI_MODEL.

   Privacy: free Gemini keys may let the provider use requests to improve its
   products. Do not use real patient information with a free key.
   ============================================================================ */
'use strict';

const SYSTEM_PROMPT = [
  'You help organise symptom information into a short report a person can bring to a healthcare professional.',
  'You receive JSON with the information the person entered. Use ONLY that information.',
  'Rules you must follow:',
  '- Do not diagnose, name likely conditions, or say what the person "has".',
  '- Do not mention or suggest medicines, treatments or doses.',
  '- Do not reassure. Never say symptoms are harmless, minor or will pass.',
  '- Do not invent symptoms, history, vital signs, test results or findings.',
  '- Do not decide how urgent things are. Urgency is handled elsewhere.',
  '- Use plain, cautious, easy-to-read language.',
  'Return ONLY a JSON object, with no markdown and no extra text, shaped exactly like:',
  '{"summary": string (max 700 characters, restating the entered information),',
  ' "questions": string[] (3 to 6 questions the person could ask a healthcare professional, each under 200 characters),',
  ' "missingInfo": string[] (0 to 4 things that were not provided and may be worth noting before a visit, each under 200 characters)}'
].join('\n');

function config() {
  const env = process.env;
  const anthropicKey = env.ANTHROPIC_API_KEY || '';
  const geminiKey = env.GEMINI_API_KEY || '';
  let provider = (env.AI_PROVIDER || '').toLowerCase();
  if (provider !== 'gemini' && provider !== 'anthropic') provider = geminiKey && !anthropicKey ? 'gemini' : (anthropicKey ? 'anthropic' : (geminiKey ? 'gemini' : ''));
  const key = provider === 'gemini' ? geminiKey : provider === 'anthropic' ? anthropicKey : '';
  return {
    provider: provider,
    key: key,
    enabled: Boolean(key),
    anthropicUrl: env.ANTHROPIC_API_URL || 'https://api.anthropic.com/v1/messages',
    anthropicModel: env.AI_MODEL || 'claude-sonnet-5-5',
    geminiModel: env.GEMINI_MODEL || 'gemini-2.5-flash',
    geminiUrl: env.GEMINI_API_URL || ''
  };
}

// Very small rate limit: 10 requests per minute per address (per server instance).
const recentCalls = new Map();
function isRateLimited(address) {
  const now = Date.now();
  const calls = (recentCalls.get(address || 'unknown') || []).filter(function (t) { return now - t < 60000; });
  calls.push(now);
  recentCalls.set(address || 'unknown', calls);
  return calls.length > 10;
}

const text = function (value, max) { return String(value === undefined || value === null ? '' : value).slice(0, max); };
const textList = function (value, maxItems, maxLen) {
  return Array.isArray(value) ? value.slice(0, maxItems).map(function (v) { return text(v, maxLen); }) : [];
};

// Copy over only the fields we expect, so nothing unexpected reaches the AI.
function cleanPayload(body) {
  return {
    ageGroup: text(body.ageGroup, 40),
    symptoms: textList(body.symptoms, 30, 40),
    symptomDetails: textList(body.symptomDetails, 20, 120),
    otherSymptoms: text(body.otherSymptoms, 300),
    duration: text(body.duration, 40),
    severity: text(body.severity, 40),
    temperature: text(body.temperature, 20),
    pain: text(body.pain, 40),
    worsening: text(body.worsening, 40),
    warningSigns: textList(body.warningSigns, 20, 160),
    details: text(body.details, 300)
  };
}

async function postJson(url, headers, body) {
  const controller = new AbortController();
  const timer = setTimeout(function () { controller.abort(); }, 20000);
  try {
    const response = await fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(body), signal: controller.signal });
    if (!response.ok) throw new Error('Upstream status ' + response.status);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function callProvider(cfg, payload) {
  const userContent = JSON.stringify(payload);
  if (cfg.provider === 'gemini') {
    const url = cfg.geminiUrl || 'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(cfg.geminiModel) + ':generateContent';
    const data = await postJson(url, { 'content-type': 'application/json', 'x-goog-api-key': cfg.key }, {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts: [{ text: userContent }] }],
      generationConfig: { maxOutputTokens: 2000, temperature: 0.2, responseMimeType: 'application/json' }
    });
    const parts = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || [];
    return parts.map(function (p) { return p.text || ''; }).join('');
  }
  const data = await postJson(cfg.anthropicUrl, { 'content-type': 'application/json', 'x-api-key': cfg.key, 'anthropic-version': '2023-06-01' }, {
    model: cfg.anthropicModel, max_tokens: 800, system: SYSTEM_PROMPT, messages: [{ role: 'user', content: userContent }]
  });
  const block = (data.content || []).find(function (b) { return b.type === 'text'; });
  return block ? block.text : '';
}

async function askModel(payload) {
  const cfg = config();
  const raw = await callProvider(cfg, payload);
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON in model reply');
  const parsed = JSON.parse(match[0]);
  if (typeof parsed.summary !== 'string' || !Array.isArray(parsed.questions) || !Array.isArray(parsed.missingInfo)) {
    throw new Error('Unexpected reply shape');
  }
  return { summary: parsed.summary, questions: parsed.questions, missingInfo: parsed.missingInfo };
}

// Shared by both hosts. Returns { status, body }.
async function handleReportRequest(body, address) {
  const cfg = config();
  if (!cfg.enabled) return { status: 503, body: { error: 'AI is not configured on this server.' } };
  if (isRateLimited(address)) return { status: 429, body: { error: 'Too many requests. Please wait a minute.' } };
  if (!body || typeof body !== 'object') return { status: 400, body: { error: 'Invalid request.' } };
  try {
    return { status: 200, body: await askModel(cleanPayload(body)) };
  } catch (err) {
    // Only the error type is logged - never the person's answers.
    console.error('AI request failed:', err.message);
    return { status: 502, body: { error: 'The AI service is unavailable.' } };
  }
}

function statusBody() {
  const cfg = config();
  return { enabled: cfg.enabled, provider: cfg.enabled ? cfg.provider : '' };
}

module.exports = { handleReportRequest, statusBody, cleanPayload, config };
