/** GET /api/topics/city/:city — topic row from Topics API (PDF). */
export type TopicFromApi = {
  rank: number;
  city: string;
  title: string;
  category: string;
  trend_score: number;
  streak_days: number;
  description: string;
};

export type TopicsByCityResponse = {
  success: boolean;
  city: string;
  count: number;
  topics: TopicFromApi[];
};
