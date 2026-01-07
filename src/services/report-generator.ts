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
    const averageSleepDuration = entries.reduce((sum, entry) => sum + (entry.duration || 0), 0) / entries.length;
    
    // For simplicity, we'll set consistency score and catchup sleep hours to placeholder values
    // In a real implementation, these would be calculated from the entries
    const consistencyScore = 75; // Placeholder value
    const catchupSleepHours = 3; // Placeholder value
    
    // Generate summary text
    const summary = `Weekly sleep summary for ${startDate.toDateString()} to ${endDate.toDateString()}. 
      Average sleep duration: ${averageSleepDuration.toFixed(1)} hours. 
      Consistency score: ${consistencyScore}/100. 
      Catch-up sleep hours: ${catchupSleepHours} hours.`;
    
    // Generate trends
    const trends = [
      "Sleep duration shows moderate improvement over the past month",
      "Weekend recovery sleep has increased by 15% compared to last week",
      "Consistency in weekday sleep schedule improved slightly"
    ];
    
    // Generate visualization placeholders
    const sleepPatternChart = "Chart: Sleep pattern over the week";
    const consistencyChart = "Chart: Sleep consistency score";
    
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