import { SleepEntry } from '../models/sleep-entry';
import { getStartOfWeek, getEndOfWeek } from '../utils/date-utils';

interface WeeklyReport {
  period: {
    startDate: Date;
    endDate: Date;
  };
  summary: string;
  keyMetrics: {
    averageSleepDuration: number;
    consistencyScore: number;
    catchupSleepHours: number;
  };
  trends: string[];
  visualizations: {
    sleepPatternChart: string;
    consistencyChart: string;
  };
}

class ReportGenerator {
  /**
   * Generates a weekly summary report
   * @param entries - Array of sleep entries for the week
   * @param startDate - Start date of the week
   */
  static generateWeeklyReport(entries: SleepEntry[], startDate: Date): WeeklyReport {
    const endDate = getEndOfWeek(startDate);
    
    // Calculate key metrics
    const totalDuration = entries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
    const averageSleepDuration = entries.length > 0 ? totalDuration / entries.length : 0;
    
    // For simplicity, we'll use a placeholder consistency score
    // In a real implementation, this would be calculated from the actual data
    const consistencyScore = 75; // Placeholder value
    
    // Calculate catch-up sleep hours (weekend recovery)
    const weekendEntries = entries.filter(entry => entry.isWeekend);
    const catchupSleepHours = weekendEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
    
    // Generate summary text
    const summary = `Weekly Sleep Summary: You averaged ${averageSleepDuration.toFixed(1)} hours of sleep this week, with ${catchupSleepHours.toFixed(1)} hours of weekend recovery sleep.`;
    
    // Generate trends
    const trends = [
      "Sleep duration shows moderate consistency",
      "Weekend recovery sleep is within recommended range",
      "Overall sleep pattern suggests room for improvement"
    ];
    
    // Generate visualization placeholders
    const sleepPatternChart = "Chart: Sleep Duration Over Time";
    const consistencyChart = "Chart: Sleep Schedule Consistency";
    
    return {
      period: {
        startDate,
        endDate
      },
      summary,
      keyMetrics: {
        averageSleepDuration,
        consistencyScore,
        catchupSleepHours
      },
      trends,
      visualizations: {
        sleepPatternChart,
        consistencyChart
      }
    };
  }
}

export { ReportGenerator, WeeklyReport };