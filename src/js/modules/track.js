import { track as vercelTrack } from '@vercel/analytics';

/** Sends a custom event to Google Tag Manager (dataLayer) and Vercel Analytics. */
export function track(name, params = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...params });
  vercelTrack(name, params);
}
