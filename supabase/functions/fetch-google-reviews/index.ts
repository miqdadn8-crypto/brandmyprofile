import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GOOGLE_PLACES_API_KEY = Deno.env.get("GOOGLE_PLACES_API_KEY");
const GOOGLE_PLACE_ID = Deno.env.get("GOOGLE_PLACE_ID");

interface GoogleReview {
  author_name: string;
  author_url?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!GOOGLE_PLACES_API_KEY || !GOOGLE_PLACE_ID) {
    return new Response(
      JSON.stringify({ error: "Google Places API is not configured (missing GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID)." }),
      { status: 501, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
    url.searchParams.set("place_id", GOOGLE_PLACE_ID);
    url.searchParams.set("fields", "name,rating,user_ratings_total,reviews,url");
    url.searchParams.set("reviews_sort", "newest");
    url.searchParams.set("key", GOOGLE_PLACES_API_KEY);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.status !== "OK") {
      throw new Error(`Google Places API status: ${data.status}${data.error_message ? ` - ${data.error_message}` : ""}`);
    }

    const result = data.result ?? {};
    const reviews: GoogleReview[] = result.reviews ?? [];

    const payload = {
      name: result.name ?? null,
      rating: result.rating ?? null,
      totalReviews: result.user_ratings_total ?? null,
      mapsUrl: result.url ?? null,
      reviews: reviews.map((r) => ({
        author: r.author_name,
        authorUrl: r.author_url ?? null,
        avatar: r.profile_photo_url ?? null,
        rating: r.rating,
        relativeTime: r.relative_time_description,
        text: r.text,
        time: r.time,
      })),
      fetchedAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching Google reviews:", err);
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch Google reviews";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
