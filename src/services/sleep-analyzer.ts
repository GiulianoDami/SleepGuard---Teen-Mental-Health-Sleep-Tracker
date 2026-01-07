import { SleepEntry } from '../../models/sleep-entry';
import { SleepConsistencyMetrics, SleepAnalysis } from '../../models/sleep-analysis';
import { MentalHealthInsight } from '../../models/mental-health-insight';

export class SleepAnalyzer {
  /**
   * Analyzes sleep entries and returns consistency metrics
   * @param entries - Array of sleep entries to analyze
   */
  static analyzeSleepConsistency(entries: SleepEntry[]): SleepConsistencyMetrics {
    if (entries.length === 0) {
      return {
        weekdayConsistency: 0,
        weekendRecovery: 0,
        sleepDebt: 0,
        sleepVariability: 0
      };
    }

    const weekdayEntries = entries.filter(entry => !entry.isWeekend);
    const weekendEntries = entries.filter(entry => entry.isWeekend);

    // Calculate weekday consistency (percentage of entries within 1 hour of average)
    let weekdayConsistency = 0;
    if (weekdayEntries.length > 0) {
      const weekdayDurations = weekdayEntries.map(entry => entry.duration || 0);
      const avgWeekdayDuration = weekdayDurations.reduce((a, b) => a + b, 0) / weekdayDurations.length;
      
      const consistentEntries = weekdayDurations.filter(duration => 
        Math.abs(duration - avgWeekdayDuration) <= 1
      ).length;
      
      weekdayConsistency = (consistentEntries / weekdayEntries.length) * 100;
    }

    // Calculate weekend recovery sleep
    const weekendRecovery = weekendEntries.reduce((total, entry) => {
      return total + (entry.duration || 0);
    }, 0);

    // Calculate sleep debt (assuming 8 hours is ideal)
    const idealSleepDuration = 8;
    const sleepDebt = entries.reduce((total, entry) => {
      const duration = entry.duration || 0;
      return total + Math.max(0, idealSleepDuration - duration);
    }, 0);

    // Calculate sleep variability (standard deviation of sleep times)
    let sleepVariability = 0;
    if (weekdayEntries.length > 1) {
      const durations = weekdayEntries.map(entry => entry.duration || 0);
      const mean = durations.reduce((a, b) => a + b, 0) / durations.length;
      const variance = durations.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / (durations.length - 1);
      sleepVariability = Math.sqrt(variance);
    }

    return {
      weekdayConsistency,
      weekendRecovery,
      sleepDebt,
      sleepVariability
    };
  }

  /**
   * Calculates optimal catch-up sleep requirements
   * @param entries - Array of sleep entries to analyze
   * @param targetSleepDuration - Target sleep duration in hours
   */
  static calculateOptimalCatchup(entries: SleepEntry[], targetSleepDuration: number): number {
    const weekdayEntries = entries.filter(entry => !entry.isWeekend);
    
    if (weekdayEntries.length === 0) {
      return 0;
    }

    const totalWeekdaySleep = weekdayEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
    const idealWeekdaySleep = weekdayEntries.length * targetSleepDuration;
    const sleepDeficit = Math.max(0, idealWeekdaySleep - totalWeekdaySleep);
    
    // Cap at maximum allowed catch-up hours (default 4)
    return Math.min(sleepDeficit, 4);
  }

  /**
   * Calculates sleep quality score based on various factors
   * @param entries - Array of sleep entries to analyze
   */
  static calculateSleepQualityScore(entries: SleepEntry[]): number {
    if (entries.length === 0) {
      return 0;
    }

    const consistencyMetrics = this.analyzeSleepConsistency(entries);
    const { weekdayConsistency, sleepVariability, sleepDebt } = consistencyMetrics;

    // Base score from consistency (0-100)
    let baseScore = weekdayConsistency;

    // Adjust for sleep variability (lower variability = better)
    const variabilityPenalty = Math.min(sleepVariability * 5, 30); // Max penalty of 30 points
    baseScore = Math.max(0, baseScore - variabilityPenalty);

    // Adjust for sleep debt (more debt = lower score)
    const debtPenalty = Math.min(sleepDebt * 5, 40); // Max penalty of 40 points
    baseScore = Math.max(0, baseScore - debtPenalty);

    // Normalize to 0-100 scale
    return Math.round(Math.min(100, Math.max(0, baseScore)));
  }

  /**
   * Generates mental health insights from sleep analysis
   * @param analysis - Sleep analysis results
   * @param entries - Original sleep entries
   */
  static generateMentalHealthInsights(analysis: SleepAnalysis, entries: SleepEntry[]): MentalHealthInsight {
    const recommendations: Recommendation[] = [];
    const improvementAreas: string[] = [];
    const successFactors: string[] = [];

    // Check consistency score
    if (analysis.consistencyScore < 60) {
      recommendations.push({
        category: 'sleep-schedule',
        description: 'Your sleep schedule shows low consistency. Try to maintain regular sleep and wake times.',
        priority: 'high',
        impact: 'high'
      });
      improvementAreas.push('Inconsistent sleep schedule');
    } else {
      successFactors.push('Good sleep schedule consistency');
    }

    // Check sleep debt
    if (analysis.metrics.sleepDebt > 2) {
      recommendations.push({
        category: 'catchup-sleep',
        description: 'You have accumulated significant sleep debt. Consider getting more sleep on weekends.',
        priority: 'medium',
        impact: 'medium'
      });
      improvementAreas.push('Sleep debt accumulation');
    } else if (analysis.metrics.sleepDebt > 0) {
      recommendations.push({
        category: 'catchup-sleep',
        description: 'You have some sleep debt. Aim to recover a bit on weekends.',
        priority: 'low',
        impact: 'medium'
      });
    } else {
      successFactors.push('Minimal sleep debt');
    }

    // Check weekend recovery
    if (analysis.metrics.weekendRecovery < 2) {
      recommendations.push({
        category: 'catchup-sleep',
        description: 'Consider increasing your weekend recovery sleep to help offset weekday sleep loss.',
        priority: 'medium',
        impact: 'medium'
      });
    } else {
      successFactors.push('Adequate weekend recovery sleep');
    }

    // Check sleep variability
    if (analysis.metrics.sleepVariability > 1.5) {
      recommendations.push({
        category: 'consistency',
        description: 'Your sleep times vary significantly. Try to keep more consistent sleep/wake times.',
        priority: 'medium',
        impact: 'medium'
      });
      improvementAreas.push('Sleep time variability');
    } else {
      successFactors.push('Consistent sleep timing');
    }

    // Risk level based on consistency score and sleep debt
    let riskLevel: 'low' | 'moderate' | 'high' = 'low';
    if (analysis.consistencyScore < 50 || analysis.metrics.sleepDebt > 4) {
      riskLevel = 'high';
    } else if (analysis.consistencyScore < 70 || analysis.metrics.sleepDebt > 2) {
      riskLevel = 'moderate';
    }

    return {
      recommendations,
      sleepQualityScore: analysis.consistencyScore,
      riskLevel,
      improvementAreas,
      successFactors
    };
  }
}