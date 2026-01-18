/* ─────────────────────────────
   HEADERS
───────────────────────────── */

export function defaultApiHeaders() {
  return {
    Accept: 'application/json',
    // ✅ CORRECT: Use process.env.API_KEY directly
    api_key: process.env.API_KEY || 'your-default-api-key'
  };
}

export function defaultJsonHeaders() {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };
}