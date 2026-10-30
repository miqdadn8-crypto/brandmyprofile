import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GOOGLE_PLACES_API_KEY = Deno.env.get("GOOGLE_PLACES_API_KEY");
const GOOGLE_PLACE_ID = Deno.env.get("GOOGLE_PLACE_ID");

// Places API (New) review shape. The legacy Place Details endpoint cannot be enabled on new
// Google Cloud projects, so this uses https://places.googleapis.com/v1/places/{id}.
interface PlacesReview {
  rating?: number;
  relativePublishTimeDescription?: string;
  publishTime?: string;
  text?: { text?: string };
  originalText?: { text?: string };
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
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
    // The field mask decides the billing tier: requesting `reviews` makes this an Enterprise +
    // Atmosphere call (covered by Google's free monthly allowance at this site's volume).
    const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(GOOGLE_PLACE_ID)}`, {
      headers: {
        "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": "displayName,rating,userRatingCount,reviews,googleMapsUri",
      },
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(`Google Places API error ${response.status}: ${result?.error?.message ?? response.statusText}`);
    }

    const reviews: PlacesReview[] = result.reviews ?? [];

    const payload = {
      name: result.displayName?.text ?? null,
      rating: result.rating ?? null,
      totalReviews: result.userRatingCount ?? null,
      mapsUrl: result.googleMapsUri ?? null,
      reviews: reviews
        .map((r) => ({
          author: r.authorAttribution?.displayName ?? "Google user",
          authorUrl: r.authorAttribution?.uri ?? null,
          avatar: r.authorAttribution?.photoUri ?? null,
          rating: r.rating ?? 0,
          relativeTime: r.relativePublishTimeDescription ?? "",
          text: r.text?.text ?? r.originalText?.text ?? "",
          time: r.publishTime ? Math.floor(Date.parse(r.publishTime) / 1000) : 0,
        }))
        // Newest first, as the legacy `reviews_sort=newest` did.
        .sort((a, b) => b.time - a.time),
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
