/**
 * Utility to ensure all image URLs resolve flawlessly on both
 * local development and Netlify/Vercel production deployments.
 */

export const OFFICIAL_LOGO_URL = "https://oendmrjwkhwxrfphvedl.supabase.co/storage/v1/object/public/sethsanwariya/logo.png";

export function resolveImageUrl(url?: string | null): string {
  if (!url || typeof url !== 'string') {
    return OFFICIAL_LOGO_URL;
  }

  // Replace legacy Vite dev server paths with production-ready /images/ path
  if (url.startsWith('/src/assets/images/')) {
    return url.replace('/src/assets/images/', '/images/');
  }

  return url;
}

export function handleImageFallback(e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackUrl = OFFICIAL_LOGO_URL) {
  const target = e.currentTarget;
  if (target.src !== fallbackUrl) {
    target.src = fallbackUrl;
  }
}
