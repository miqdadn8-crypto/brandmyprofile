// Vercel Edge Function: returns the visitor's country code so the client can
// map it to a supported region (see src/contexts/RegionContext.tsx).
//
// - Country-level only. Never returns, stores, or logs the visitor's IP address.
// - Reads Vercel's own request-geo header - no third-party geolocation service,
//   no navigator.geolocation, no permission prompt.
// - `cache-control: no-store` so responses are never cached/reused across visitors.

export const config = { runtime: "edge" };

export default function handler(request: Request) {
  const country = request.headers.get("x-vercel-ip-country") ?? "";

  return new Response(JSON.stringify({ country }), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}
