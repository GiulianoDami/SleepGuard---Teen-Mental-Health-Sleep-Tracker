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
    const weekendRecovery = weekendEntries.reduce((total, entry) => 
      total + (entry.duration || 0), 0
    );

    // Calculate sleep debt (assuming 8 hours is ideal)
    const idealSleepDuration = 8;
    const totalSleep = entries.reduce((total, entry) => 
      total + (entry.duration || 0), 0
    );
    const idealSleep = entries.length * idealSleepDuration;
    const sleepDebt = Math.max(0, idealSleep - totalSleep);

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

    const totalWeekdaySleep = weekdayEntries.reduce((total, entry) => 
      total + (entry.duration || 0), 0
    );
    
    const idealWeekdaySleep = weekdayEntries.length * targetSleepDuration;
    const sleepDeficit = Math.max(0, idealWeekdaySleep - totalWeekdaySleep);
    
    // Cap at reasonable limit (e.g., 4 hours)
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
    const avgDuration = entries.reduce((sum, entry) => sum + (entry.duration || 0), 0) / entries.length;
    
    // Base score from consistency
    let baseScore = consistencyMetrics.weekdayConsistency;
    
    // Adjust for duration (ideal is 7-9 hours)
    let durationScore = 0;
    if (avgDuration >= 7 && avgDuration <= 9) {
      durationScore = 100;
    } else if (avgDuration >= 6 && avgDuration <= 10) {
      durationScore = 80;
    } else if (avgDuration >= 5 && avgDuration <= 11) {
      durationScore = 60;
    } else {
      durationScore = 40;
    }
    
    // Adjust for sleep debt
    let debtScore = 100;
    if (consistencyMetrics.sleepDebt > 4) {
      debtScore = 40;
    } else if (consistencyMetrics.sleepDebt > 2) {
      debtScore = 60;
    } else if (consistencyMetrics.sleepDebt > 0) {
      debtScore = 80;
    }
    
    // Weighted average
    const finalScore = (baseScore * 0.4 + durationScore * 0.3 + debtScore * 0.3);
    
    return Math.min(100, Math.max(0, finalScore));
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

    // Consistency recommendation
    if (analysis.metrics.weekdayConsistency < 70) {
      recommendations.push({
        category: 'sleep-schedule',
        description: 'Try to maintain consistent sleep and wake times throughout the week.',
        priority: 'high',
        impact: 'high'
      });
      improvementAreas.push('Inconsistent sleep schedule');
    } else {
      successFactors.push('Good sleep schedule consistency');
    }

    // Catch-up sleep recommendation
    if (analysis.metrics.weekendRecovery < 4) {
      recommendations.push({
        category: 'catchup-sleep',
        description: 'Consider getting more recovery sleep on weekends to offset weekday sleep debt.',
        priority: 'medium',
        impact: 'medium'
      });
      improvementAreas.push('Insufficient weekend recovery sleep');
    } else {
      successFactors.push('Adequate weekend recovery sleep');
    }

    // Sleep debt recommendation
    if (analysis.metrics.sleepDebt > 2) {
      recommendations.push({
        category: 'consistency',
        description: 'Address accumulated sleep debt by improving weekday sleep habits.',
        priority: 'high',
        impact: 'high'
      });
      improvementAreas.push('Accumulated sleep debt');
    } else {
      successFactors.push('Minimal sleep debt');
    }

    // Overall recommendation
    if (analysis.recommendationLevel === 'high') {
      recommendations.push({
        category: 'overall',
        description: 'Significant improvements needed in sleep patterns for optimal mental health.',
        priority: 'high',
        impact: 'high'
      });
    } else if (analysis.recommendationLevel === 'medium') {
      recommendations.push({
        category: 'overall',
        description: 'Some improvements would benefit your mental health and sleep quality.',
        priority: 'medium',
        impact: 'medium'
      });
    } else {
      recommendations.push({
        category: 'overall',
        description: 'Your sleep patterns are generally healthy and supportive of good mental health.',
        priority: 'low',
        impact: 'low'
      });
      successFactors.push('Overall healthy sleep patterns');
    }

    // Risk level determination
    let riskLevel: 'low' | 'moderate' | 'high' = 'low';
    if (analysis.metrics.sleepDebt > 4 || analysis.metrics.weekdayConsistency < 50) {
      riskLevel = 'high';
    } else if (analysis.metrics.sleepDebt > 2 || analysis.metrics.weekdayConsistency < 70) {
      riskLevel = 'moderate';
    }

    return {
      recommendations,
      sleepQualityScore: this.calculateSleepQualityScore(entries),
      riskLevel,
      improvementAreas,
      successFactors
    };
  }
}

interface Recommendation {
  category: 'sleep-schedule' | 'catchup-sleep' | 'consistency' | 'overall';
  description: string;
  priority: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
}