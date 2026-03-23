import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err.response?.data || err)
);

// ─── In-memory cache for public GET endpoints ────────────────────────────────
// Stores { data, ts } per URL key. TTL in milliseconds.
const _cache = {};
const TTL = {
  '/foods':          30_000,   // 30s — menu
  '/foods/featured': 60_000,   // 60s — featured items
  '/gallery':        60_000,   // 60s — gallery
  '/coupons/public': 120_000,  // 2 min — coupons
};

/**
 * cachedGet(url, config?)
 * Drop-in replacement for api.get() on public read endpoints.
 * Returns cached data immediately if fresh, otherwise fetches + caches.
 */
export async function cachedGet(url, config = {}) {
  const ttl = TTL[url];
  if (ttl) {
    const hit = _cache[url];
    if (hit && Date.now() - hit.ts < ttl) {
      return { data: hit.data };
    }
  }
  const res = await api.get(url, config);
  if (ttl) _cache[url] = { data: res.data, ts: Date.now() };
  return res;
}

/** Call this after admin mutations to bust the relevant cache entry */
export function bustCache(url) {
  delete _cache[url];
}

export default api;
