
import { Event } from "@/types/event";
import { format, isBefore, isSameDay } from "date-fns";

// Checks for scheduling conflicts
export function checkEventConflicts(events: Event[], newEvent: Event): { hasConflict: boolean; conflictingEvent?: Event } {
  // Convert time strings to minutes for easier comparison
  const newEventStart = timeStringToMinutes(newEvent.startTime);
  const newEventEnd = newEventStart + newEvent.duration;
  
  // Check only events on the same day
  const sameDay = events.filter(event => 
    isSameDay(event.date, newEvent.date)
  );
  
  for (const event of sameDay) {
    // Skip comparing with itself (for updates)
    if (event.id === newEvent.id) continue;
    
    const eventStart = timeStringToMinutes(event.startTime);
    const eventEnd = eventStart + event.duration;
    
    // Check if events overlap
    if (
      (newEventStart >= eventStart && newEventStart < eventEnd) || 
      (newEventEnd > eventStart && newEventEnd <= eventEnd) ||
      (newEventStart <= eventStart && newEventEnd >= eventEnd)
    ) {
      return { hasConflict: true, conflictingEvent: event };
    }
  }
  
  return { hasConflict: false };
}

// Helper to convert time string (HH:MM) to minutes
function timeStringToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

// Get the next upcoming event
export function getUpcomingEvent(events: Event[]): Event | null {
  const now = new Date();
  const today = new Date(format(now, 'yyyy-MM-dd'));
  const currentTime = format(now, 'HH:mm');
  
  // Get events for today that haven't happened yet
  const upcomingEvents = events
    .filter(event => 
      isSameDay(event.date, today) && 
      event.startTime > currentTime &&
      !event.completed
    )
    .sort((a, b) => {
      // Sort by start time
      return a.startTime.localeCompare(b.startTime);
    });
  
  return upcomingEvents.length > 0 ? upcomingEvents[0] : null;
}

// Count conflicts in all events
export function countAllConflicts(events: Event[]): number {
  let conflictCount = 0;
  
  events.forEach((event, index) => {
    // Create a temp array without the current event
    const otherEvents = [...events];
    otherEvents.splice(index, 1);
    
    // Check if this event conflicts with any other
    const { hasConflict } = checkEventConflicts(otherEvents, event);
    
    if (hasConflict) {
      conflictCount += 1;
    }
  });
  
  // Divide by 2 because each conflict is counted twice (once for each event involved)
  return Math.ceil(conflictCount / 2);
}

// Helpers to manage event storage
export function saveEvents(events: Event[]): void {
  localStorage.setItem('journal-events', JSON.stringify(events));
}

export function loadEvents(): Event[] {
  const saved = localStorage.getItem('journal-events');
  if (!saved) return [];
  
  try {
    const parsed = JSON.parse(saved);
    return parsed.map((event: any) => ({
      ...event,
      date: new Date(event.date)
    }));
  } catch (error) {
    console.error('Error parsing saved events', error);
    return [];
  }
}
