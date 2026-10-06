import fallback from '../assets/gallery/gallery_001.jpeg';

// Vite-only development has no Worker; Cloudflare development serves /api/images.
export const img = (slot) => import.meta.env.DEV
  ? fallback
  : `/api/images/${encodeURIComponent(slot)}`;
