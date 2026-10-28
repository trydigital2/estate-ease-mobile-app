/**
 * Real Estate Neighborhood Livability & Commute Analysis
 * Evaluates composite livability index (0 - 100), walkability,
 * public transit accessibility, school district ratings, and commute times.
 */

export type LivabilityTier = "Exceptional" | "Highly Desirable" | "Balanced Urban" | "Emerging";

export interface NeighborhoodInputs {
  walkScore: number; // 0 - 100
  transitScore: number; // 0 - 100
  schoolRating: number; // 1 - 10
  safetyRating: number; // 1 - 10
  parkAccessScore?: number; // 0 - 100
}

export interface NeighborhoodMetrics {
  compositeScore: number; // 0 - 100
  tier: LivabilityTier;
  walkRatingLabel: string;
  transitRatingLabel: string;
  lifestyleTags: string[];
  summary: string;
}

export interface CommuteEstimate {
  destination: string;
  distanceMiles: number;
  driveMinutes: number;
  transitMinutes: number;
  walkMinutes: number;
}

/**
 * Calculates a weighted composite neighborhood livability score:
 * - Walkability: 30%
 * - Transit Access: 25%
 * - School District: 25%
 * - Safety & Environment: 20%
 */
export function calculateNeighborhoodLivability(inputs: NeighborhoodInputs): NeighborhoodMetrics {
  const { walkScore, transitScore, schoolRating, safetyRating, parkAccessScore = 75 } = inputs;

  const normalizedSchool = Math.min(100, schoolRating * 10);
  const normalizedSafety = Math.min(100, safetyRating * 10);

  const weightedScore =
    walkScore * 0.3 +
    transitScore * 0.25 +
    normalizedSchool * 0.25 +
    normalizedSafety * 0.15 +
    parkAccessScore * 0.05;

  const compositeScore = Math.round(Math.min(100, Math.max(0, weightedScore)));

  let tier: LivabilityTier = "Balanced Urban";
  let summary = "Balanced suburban environment with steady access to everyday services and transit.";

  if (compositeScore >= 88) {
    tier = "Exceptional";
    summary = "Premier urban enclave with world-class walkability, top-tier schools, and transit nodes.";
  } else if (compositeScore >= 75) {
    tier = "Highly Desirable";
    summary = "Highly sought-after community offering strong conveniences, safe streets, and parkland.";
  } else if (compositeScore < 60) {
    tier = "Emerging";
    summary = "Growing corridor with expanding infrastructure and long-term appreciation potential.";
  }

  let walkRatingLabel = "Somewhat Walkable";
  if (walkScore >= 90) walkRatingLabel = "Walker Paradise (Daily errands require no car)";
  else if (walkScore >= 70) walkRatingLabel = "Very Walkable (Most errands on foot)";
  else if (walkScore < 50) walkRatingLabel = "Car-Dependent";

  let transitRatingLabel = "Some Transit";
  if (transitScore >= 80) transitRatingLabel = "Rider Paradise (World-class transit)";
  else if (transitScore >= 60) transitRatingLabel = "Good Transit (Many nearby options)";

  const lifestyleTags: string[] = [];
  if (walkScore >= 80) lifestyleTags.push("Pedestrian Friendly");
  if (transitScore >= 70) lifestyleTags.push("Commuter Haven");
  if (schoolRating >= 8) lifestyleTags.push("Top School District");
  if (safetyRating >= 8) lifestyleTags.push("Safe & Quiet");
  if (parkAccessScore >= 75) lifestyleTags.push("Parks & Recreation");

  return {
    compositeScore,
    tier,
    walkRatingLabel,
    transitRatingLabel,
    lifestyleTags,
    summary,
  };
}

/**
 * Calculates estimated commute times based on distance and standard urban speeds.
 */
export function estimateCommutes(distanceMiles: number): { drive: number; transit: number; walk: number } {
  // Average speeds: Drive 25 mph, Transit 15 mph, Walk 3 mph
  const drive = Math.round((distanceMiles / 25) * 60);
  const transit = Math.round((distanceMiles / 15) * 60 + 5); // +5 min wait
  const walk = Math.round((distanceMiles / 3) * 60);

  return {
    drive: Math.max(2, drive),
    transit: Math.max(5, transit),
    walk: Math.max(5, walk),
  };
}
