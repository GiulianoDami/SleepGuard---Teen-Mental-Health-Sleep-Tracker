/**
 * Gets the start of the week (Monday) for a given date
 * @param date - Input date
 */
export function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  d.setDate(diff);
  return d;
}

/**
 * Gets the end of the week (Sunday) for a given date
 * @param date - Input date
 */
export function getEndOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + 6; // Adjust when day is Sunday
  d.setDate(diff);
  return d;
}

/**
 * Formats time string to 24-hour format
 * @param timeString - Time in HH:mm or HH:mm AM/PM format
 */
export function formatTimeTo24Hour(timeString: string): string {
  const [time, period] = timeString.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Calculates duration between two times in hours
 * @param startTime - Start time in format HH:mm
 * @param endTime - End time in format HH:mm
 */
export function calculateDuration(startTime: string, endTime: string): number {
  const start24 = formatTimeTo24Hour(startTime);
  const end24 = formatTimeTo24Hour(endTime);
  
  const [startHours, startMinutes] = start24.split(':').map(Number);
  const [endHours, endMinutes] = end24.split(':').map(Number);
  
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;
  
  let durationMinutes = endTotalMinutes - startTotalMinutes;
  
  // Handle overnight sleep
  if (durationMinutes < 0) {
    durationMinutes += 24 * 60;
  }
  
  return durationMinutes / 60;
}

/**
 * Checks if a date represents a weekend
 * @param date - Date to check
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}