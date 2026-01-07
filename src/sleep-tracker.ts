import { SleepEntry } from './models/sleep-entry';
import { SleepAnalysis } from './models/sleep-analysis';
import { MentalHealthInsight } from './models/mental-health-insight';
import { SleepAnalyzer } from './services/sleep-analyzer';
import { ReportGenerator } from './services/report-generator';
import { getStartOfWeek, getEndOfWeek, isWeekend } from './utils/date-utils';

interface SleepTrackerConfig {
  maxWeekendCatchupHours?: number;
  minSleepDuration?: number;
  targetSleepDuration?: number;
}

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

class SleepTracker {
  private sleepEntries: SleepEntry[] = [];
  private config: SleepTrackerConfig;

  constructor(config?: SleepTrackerConfig) {
    this.config = {
      maxWeekendCatchupHours: config?.maxWeekendCatchupHours || 3,
      minSleepDuration: config?.minSleepDuration || 6,
      targetSleepDuration: config?.targetSleepDuration || 8
    };
  }

  logSleep(sleepData: Omit<SleepEntry, 'id'>): string {
    const newEntry: SleepEntry = {
      ...sleepData,
      id: Math.random().toString(36).substr(2, 9),
      duration: this.calculateDuration(sleepData.startTime, sleepData.endTime)
    };

    this.sleepEntries.push(newEntry);
    return newEntry.id;
  }

  getSleepEntries(startDate?: Date, endDate?: Date): SleepEntry[] {
    let filteredEntries = [...this.sleepEntries];

    if (startDate) {
      filteredEntries = filteredEntries.filter(entry => entry.date >= startDate);
    }

    if (endDate) {
      filteredEntries = filteredEntries.filter(entry => entry.date <= endDate);
    }

    return filteredEntries.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  getHealthInsights(): MentalHealthInsight {
    const allEntries = this.getSleepEntries();
    
    if (allEntries.length === 0) {
      return {
        recommendations: [],
        sleepQualityScore: 0,
        riskLevel: 'low',
        improvementAreas: [],
        successFactors: []
      };
    }

    const analysis: SleepAnalysis = {
      metrics: SleepAnalyzer.analyzeSleepConsistency(allEntries),
      optimalCatchupHours: SleepAnalyzer.calculateOptimalCatchup(
        allEntries, 
        this.config.targetSleepDuration || 8
      ),
      consistencyScore: 0,
      recommendationLevel: 'low'
    };

    return SleepAnalyzer.generateMentalHealthInsights(analysis, allEntries);
  }

  generateWeeklyReport(startDate?: Date): WeeklyReport {
    const start = startDate || new Date();
    const weekStart = getStartOfWeek(start);
    const weekEnd = getEndOfWeek(start);
    
    const weeklyEntries = this.getSleepEntries(weekStart, weekEnd);
    
    return ReportGenerator.generateWeeklyReport(weeklyEntries, weekStart);
  }

  updateConfig(newConfig: Partial<SleepTrackerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  private calculateDuration(startTime: string, endTime: string): number {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    let startTotalMinutes = startHours * 60 + startMinutes;
    let endTotalMinutes = endHours * 60 + endMinutes;
    
    if (endTotalMinutes < startTotalMinutes) {
      endTotalMinutes += 24 * 60;
    }
    
    return (endTotalMinutes - startTotalMinutes) / 60;
  }
}