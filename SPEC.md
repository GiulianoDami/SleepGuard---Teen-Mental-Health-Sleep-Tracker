# SleepGuard Technical Specification

## File Structure


src/
├── index.ts
├── sleep-tracker.ts
├── models/
│   ├── sleep-entry.ts
│   ├── sleep-analysis.ts
│   └── mental-health-insight.ts
├── services/
│   ├── sleep-analyzer.ts
│   └── report-generator.ts
└── utils/
    └── date-utils.ts


## Files and Specifications

### `src/index.ts`
**Purpose**: Entry point of the application
typescript
// Exports all public APIs for the SleepGuard library

export { SleepTracker } from './sleep-tracker';
export type { SleepEntry } from './models/sleep-entry';
export type { SleepAnalysis } from './models/sleep-analysis';
export type { MentalHealthInsight } from './models/mental-health-insight';


### `src/sleep-tracker.ts`
**Purpose**: Main class managing sleep tracking functionality
typescript
interface SleepTrackerConfig {
  maxWeekendCatchupHours?: number;
  minSleepDuration?: number;
  targetSleepDuration?: number;
}

class SleepTracker {
  private sleepEntries: SleepEntry[];
  private config: SleepTrackerConfig;

  constructor(config?: SleepTrackerConfig);

  /**
   * Logs a sleep entry for a specific day
   * @param sleepData - The sleep data to log
   */
  logSleep(sleepData: Omit<SleepEntry, 'id'>): string;

  /**
   * Gets all sleep entries for a specified date range
   * @param startDate - Starting date
   * @param endDate - Ending date
   */
  getSleepEntries(startDate?: Date, endDate?: Date): SleepEntry[];

  /**
   * Calculates comprehensive sleep analysis
   */
  getHealthInsights(): MentalHealthInsight;

  /**
   * Generates a weekly sleep summary report
   * @param startDate - Optional start date for the week
   */
  generateWeeklyReport(startDate?: Date): WeeklyReport;

  /**
   * Updates configuration settings
   * @param newConfig - New configuration object
   */
  updateConfig(newConfig: Partial<SleepTrackerConfig>): void;
}


### `src/models/sleep-entry.ts`
**Purpose**: Data model representing a single sleep record
typescript
interface SleepEntry {
  id: string;
  date: Date;
  startTime: string; // Format HH:mm
  endTime: string;   // Format HH:mm
  isWeekend: boolean;
  duration?: number; // Calculated in hours
}


### `src/models/sleep-analysis.ts`
**Purpose**: Data model for storing sleep analysis results
typescript
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


### `src/models/mental-health-insight.ts`
**Purpose**: Data model for mental health insights and recommendations
typescript
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


### `src/services/sleep-analyzer.ts`
**Purpose**: Core business logic for analyzing sleep data
typescript
class SleepAnalyzer {
  /**
   * Analyzes sleep entries and returns consistency metrics
   * @param entries - Array of sleep entries to analyze
   */
  static analyzeSleepConsistency(entries: SleepEntry[]): SleepConsistencyMetrics;

  /**
   * Calculates optimal catch-up sleep requirements
   * @param entries - Array of sleep entries to analyze
   * @param targetSleepDuration - Target sleep duration in hours
   */
  static calculateOptimalCatchup(entries: SleepEntry[], targetSleepDuration: number): number;

  /**
   * Calculates sleep quality score based on various factors
   * @param entries - Array of sleep entries to analyze
   */
  static calculateSleepQualityScore(entries: SleepEntry[]): number;

  /**
   * Generates mental health insights from sleep analysis
   * @param analysis - Sleep analysis results
   * @param entries - Original sleep entries
   */
  static generateMentalHealthInsights(analysis: SleepAnalysis, entries: SleepEntry[]): MentalHealthInsight;
}


### `src/services/report-generator.ts`
**Purpose**: Generates formatted reports from sleep data
typescript
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
  static generateWeeklyReport(entries: SleepEntry[], startDate: Date): WeeklyReport;
}


### `src/utils/date-utils.ts`
**Purpose**: Utility functions for date operations
typescript
/**
 * Gets the start of the week (Monday) for a given date
 * @param date - Input date
 */
function getStartOfWeek(date: Date): Date;

/**
 * Gets the end of the week (Sunday) for a given date
 * @param date - Input date
 */
function getEndOfWeek(date: Date): Date;

/**
 * Formats time string to 24-hour format
 * @param timeString - Time in HH:mm or HH:mm AM/PM format
 */
function formatTimeTo24Hour(timeString: string): string;

/**
 * Calculates duration between two times in hours
 * @param startTime - Start time in format HH:mm
 * @param endTime - End time in format HH:mm
 */
function calculateDuration(startTime: string, endTime: string): number;

/**
 * Checks if a date represents a weekend
 * @param date - Date to check
 */
function isWeekend(date: Date): boolean;