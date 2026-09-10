import { useEffect, useState } from "react";
import { googleReviewsService, type GoogleReviewsData } from "@/services/googleReviewsService";

export function useGoogleReviews() {
  const [data, setData] = useState<GoogleReviewsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    googleReviewsService.fetchReviews().then((result) => {
      if (!cancelled) {
        setData(result);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    isLive: data !== null && data.reviews.length > 0,
    isLoading,
    rating: data?.rating ?? null,
    totalReviews: data?.totalReviews ?? null,
    mapsUrl: data?.mapsUrl ?? null,
    reviews: data?.reviews ?? [],
  };
}
