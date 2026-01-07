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
  const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
  const match = timeString.match(timeRegex);
  
  if (!match) {
    throw new Error('Invalid time format. Expected HH:mm AM/PM');
  }
  
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const ampm = match[3].toUpperCase();
  
  if (ampm === 'AM' && hours === 12) {
    hours = 0;
  } else if (ampm === 'PM' && hours !== 12) {
    hours += 12;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

/**
 * Calculates duration between two times in hours
 * @param startTime - Start time in format HH:mm
 * @param endTime - End time in format HH:mm
 */
export function calculateDuration(startTime: string, endTime: string): number {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  let startTotalMinutes = startHours * 60 + startMinutes;
  let endTotalMinutes = endHours * 60 + endMinutes;
  
  // Handle overnight sleep (end time is next day)
  if (endTotalMinutes < startTotalMinutes) {
    endTotalMinutes += 24 * 60; // Add 24 hours in minutes
  }
  
  const durationMinutes = endTotalMinutes - startTotalMinutes;
  return durationMinutes / 60;
}

/**
 * Checks if a date represents a weekend
 * @param date - Date to check
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}