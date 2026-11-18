// A dated snapshot of the business's real Google reviews, copied verbatim (owner screenshot of
// the Google profile, read 17 Nov 2026). Used only where the live feed (useGoogleReviews) is
// unavailable, and in the hero, which must not make a network request on first load.
// Rules: verbatim text only, real reviewer names, never edited or invented. Update the rating
// and add newer reviews when you refresh it, and change COLLECTED to the date you read them.
export const REVIEWS_COLLECTED = "November 2026";

export const RATING_SNAPSHOT = { rating: 4.9, totalReviews: 32 } as const;

export const REVIEW_SNAPSHOT = [
  {
    author: "George Poulose",
    rating: 5,
    text: "Very quick and fast response I like the service",
    time: 2026111101,
  },
  {
    author: "Omnia El-khayat",
    rating: 5,
    text: "A professional and exceptional service center\nI highly recommend",
    time: 2026111001,
  },
] as const;
