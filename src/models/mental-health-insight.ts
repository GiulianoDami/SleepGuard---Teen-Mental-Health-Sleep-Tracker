interface Recommendation {
  category: 'sleep-schedule' | 'catchup-sleep' | 'consistency' | 'overall';
  description: string;
  priority: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
}

interface MentalHealthInsight {
  recommendations: Recommendation[];
  sleepQualityScore: number;
  riskLevel: 'low' | 'moderate' | 'high';
  improvementAreas: string[];
  successFactors: string[];
}