/* Omnidite Telemetry SDK v1.0
 * Privacy-aware portfolio analytics: pageviews, active time, custom events,
 * errors and performance. Never captures form values, keystroke contents,
 * DOM text, passwords, or session replay data.
 */
(() => {
  'use strict';

  const script = document.currentScript;
  if (!script) return;
  const project = script.dataset.project || '';
  const token = script.dataset.token || '';
  const endpoint = script.dataset.endpoint || 'https://czekmoxnnbpjimcoehus.supabase.co/functions/v1/telemetry-collect';
  if (!project || !token) return;

  const host = location.hostname;
  if (host === 'localhost' || host === '127.0.0.1' || host === '::1') return;
  if (navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true) return;

  const VISITOR_KEY = `omnidite:telemetry:${project}:visitor:v1`;
  const SESSION_KEY = `omnidite:telemetry:${project}:session:v1`;
  const SESSION_TTL = 30 * 60 * 1000;
  const IDLE_LIMIT = 5 * 60 * 1000;
  const ACTIVITY_FLUSH_MS = 60 * 1000;

  function uuid() {
    if (crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function storageGet(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }
  function storageSet(key, value) {
    try { localStorage.setItem(key, value); } catch { /* storage may be blocked */ }
  }

  let visitorId = storageGet(VISITOR_KEY);
  if (!visitorId) {
    visitorId = uuid();
    storageSet(VISITOR_KEY, visitorId);
  }

  function loadSession() {
    try {
      const raw = storageGet(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.id && Number.isFinite(parsed.last) && Date.now() - parsed.last < SESSION_TTL) return parsed;
      }
    } catch { /* replace invalid session */ }
    return { id: uuid(), last: Date.now() };
  }

  let session = loadSession();
  function touchSession() {
    session.last = Date.now();
    storageSet(SESSION_KEY, JSON.stringify(session));
  }
  touchSession();

  function cleanReferrer() {
    if (!document.referrer) return '';
    try {
      const u = new URL(document.referrer);
      return `${u.origin}${u.pathname}`.slice(0, 2048);
    } catch { return ''; }
  }

  function currentPath() {
    const hashRoute = location.hash && location.hash.startsWith('#/') ? location.hash.slice(0, 256) : '';
    return `${location.pathname}${hashRoute}`.slice(0, 2048);
  }

  function utm() {
    const q = new URLSearchParams(location.search);
    const out = {};
    for (const k of ['utm_source','utm_medium','utm_campaign','utm_term','utm_content']) {
      const v = q.get(k);
      if (v) out[k] = v.slice(0, 256);
    }
    return out;
  }

  function clientInfo() {
    let tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch { /* ignore */ }
    return {
      language: (navigator.language || '').slice(0, 32),
      timezone: tz.slice(0, 64),
      screen_width: screen && screen.width || null,
      screen_height: screen && screen.height || null,
      viewport_width: window.innerWidth || null,
      viewport_height: window.innerHeight || null,
    };
  }

  function basePayload(type) {
    touchSession();
    return {
      project,
      token,
      event_id: uuid(),
      session_id: session.id,
      visitor_id: visitorId,
      event_type: type,
      path: currentPath(),
      title: (document.title || '').slice(0, 512),
      client_ts: new Date().toISOString(),
      referrer: cleanReferrer(),
      utm: utm(),
      client: clientInfo(),
    };
  }

  function transmit(payload, beacon = false) {
    const body = JSON.stringify(payload);
    if (body.length > 30000) return;
    if (beacon && navigator.sendBeacon) {
      try {
        const ok = navigator.sendBeacon(endpoint, new Blob([body], { type: 'text/plain;charset=UTF-8' }));
        if (ok) return;
      } catch { /* fall through */ }
    }
    try {
      fetch(endpoint, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-store',
        keepalive: true,
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body,
      }).catch(() => {});
    } catch { /* analytics must never break the app */ }
  }

  function send(type, extra = {}, beacon = false) {
    const payload = Object.assign(basePayload(type), extra);
    transmit(payload, beacon);
  }

  let lastInteraction = Date.now();
  let pendingActiveMs = 0;
  let lastActivityFlush = Date.now();
  const markInteraction = () => { lastInteraction = Date.now(); };
  for (const ev of ['pointerdown','keydown','scroll','touchstart','mousemove']) {
    addEventListener(ev, markInteraction, { passive: true });
  }

  function flushActivity(beacon = false) {
    if (pendingActiveMs <= 0) return;
    const ms = Math.min(pendingActiveMs, 300000);
    pendingActiveMs -= ms;
    lastActivityFlush = Date.now();
    send('activity', { active_ms: ms }, beacon);
  }

  setInterval(() => {
    if (document.visibilityState === 'visible' && document.hasFocus() && Date.now() - lastInteraction < IDLE_LIMIT) {
      pendingActiveMs += 1000;
    }
    if (Date.now() - lastActivityFlush >= ACTIVITY_FLUSH_MS) flushActivity(false);
  }, 1000);

  let lastPath = currentPath();
  function pageview() {
    const p = currentPath();
    lastPath = p;
    send('pageview');
  }

  function routeCheck() {
    const p = currentPath();
    if (p !== lastPath) {
      flushActivity(false);
      pageview();
    }
  }

  for (const method of ['pushState','replaceState']) {
    const original = history[method];
    if (typeof original === 'function') {
      history[method] = function(...args) {
        const result = original.apply(this, args);
        queueMicrotask(routeCheck);
        return result;
      };
    }
  }
  addEventListener('popstate', routeCheck);
  addEventListener('hashchange', routeCheck);

  addEventListener('error', e => {
    send('error', {
      event_name: 'window_error',
      properties: {
        message: String(e.message || 'Error').slice(0, 1000),
        filename: e.filename ? String(e.filename).split('?')[0].slice(0, 1000) : '',
        line: e.lineno || null,
        column: e.colno || null,
      },
    });
  });

  addEventListener('unhandledrejection', e => {
    let message = 'Unhandled promise rejection';
    try { message = String(e.reason && (e.reason.message || e.reason) || message).slice(0, 1000); } catch { /* ignore */ }
    send('error', { event_name: 'unhandled_rejection', properties: { message } });
  });

  addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushActivity(true);
    else markInteraction();
  });

  addEventListener('pagehide', () => {
    flushActivity(true);
    send('session_end', {}, true);
  });

  addEventListener('load', () => {
    setTimeout(() => {
      try {
        const nav = performance.getEntriesByType('navigation')[0];
        if (nav) {
          send('performance', {
            event_name: 'navigation',
            properties: {
              duration_ms: Math.round(nav.duration || 0),
              ttfb_ms: Math.round(nav.responseStart || 0),
              dom_content_loaded_ms: Math.round(nav.domContentLoadedEventEnd || 0),
              load_ms: Math.round(nav.loadEventEnd || 0),
            },
          });
        }
      } catch { /* ignore */ }
    }, 1500);
  });

  window.OmniditeTelemetry = Object.freeze({
    track(name, properties = {}) {
      if (!name) return;
      send('event', { event_name: String(name).slice(0, 128), properties });
    },
    pageview,
  });

  pageview();
})();
