import { supabase } from "@/integrations/supabase/client";

export interface GoogleReview {
  author: string;
  authorUrl: string | null;
  avatar: string | null;
  rating: number;
  relativeTime: string;
  text: string;
  time: number;
}

export interface GoogleReviewsData {
  name: string | null;
  rating: number | null;
  totalReviews: number | null;
  mapsUrl: string | null;
  reviews: GoogleReview[];
  fetchedAt: string;
}

const CACHE_KEY = "brandmyprofile_google_reviews";
const CACHE_DURATION = 1000 * 60 * 60 * 6; // 6 hours - Google's own data doesn't change more often than this in practice, and it keeps Places API usage/cost down.

const getCached = (): GoogleReviewsData | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const { data, cachedAt } = JSON.parse(cached);
    if (Date.now() - cachedAt > CACHE_DURATION) return null;
    return data;
  } catch {
    return null;
  }
};

const setCached = (data: GoogleReviewsData): void => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, cachedAt: Date.now() }));
  } catch {
    // localStorage unavailable/full - not fatal, just skip caching.
  }
};

export const googleReviewsService = {
  async fetchReviews(): Promise<GoogleReviewsData | null> {
    const cached = getCached();
    if (cached) return cached;

    const { data, error } = await supabase.functions.invoke<GoogleReviewsData>("fetch-google-reviews");

    if (error || !data || "error" in data) {
      console.warn("Google reviews unavailable, falling back to static testimonials.", error || (data as unknown as { error?: string })?.error);
      return null;
    }

    setCached(data);
    return data;
  },
};
