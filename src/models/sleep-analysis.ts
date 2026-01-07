interface SleepConsistencyMetrics {
  weekdayConsistency: number; // Percentage of consistent weekday sleep
  weekendRecovery: number;    // Hours of recovery sleep on weekends
  sleepDebt: number;          // Hours of sleep debt accumulated
  sleepVariability: number;   // Standard deviation of sleep times
}

interface SleepAnalysis {
  metrics: SleepConsistencyMetrics;
  optimalCatchupHours: number;
  consistencyScore: number;
  recommendationLevel: 'low' | 'medium' | 'high';
}