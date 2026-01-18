import { defaultApiHeaders, defaultJsonHeaders } from './headers.js';

/* ─────────────────────────────
   REQUEST HELPERS
───────────────────────────── */

export async function apiGet(request, url, options = {}) {
  const headers = {
    ...defaultApiHeaders(),
    ...(options.headers || {})
  };

  return request.get(url, { ...options, headers });
}

export async function apiPost(request, url, body = {}, options = {}) {
  const headers = {
    ...defaultJsonHeaders(),
    ...defaultApiHeaders(),
    ...(options.headers || {})
  };

  return request.post(url, {
    data: JSON.stringify(body),
    headers,
    ...options
  });
}

export async function apiPut(request, url, body = {}, options = {}) {
  const headers = {
    ...defaultJsonHeaders(),
    ...defaultApiHeaders(),
    ...(options.headers || {})
  };

  return request.put(url, {
    data: JSON.stringify(body),
    headers,
    ...options
  });
}

export async function apiDelete(request, url, options = {}) {
  const headers = {
    ...defaultApiHeaders(),
    ...(options.headers || {})
  };

  return request.delete(url, { headers, ...options });
}