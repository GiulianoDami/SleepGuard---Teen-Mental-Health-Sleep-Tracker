interface SleepEntry {
  id: string;
  date: Date;
  startTime: string; // Format HH:mm
  endTime: string;   // Format HH:mm
  isWeekend: boolean;
  duration?: number; // Calculated in hours
}