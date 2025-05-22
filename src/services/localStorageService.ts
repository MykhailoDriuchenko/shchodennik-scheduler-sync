
import { Event } from "@/types/event";

// Load events from localStorage
export const getEvents = (): Event[] => {
  try {
    const eventsJson = localStorage.getItem("events");
    if (!eventsJson) return [];
    
    const events = JSON.parse(eventsJson);
    return events.map((event: any) => ({
      ...event,
      date: new Date(event.date)
    }));
  } catch (error) {
    console.error("Error loading events from localStorage:", error);
    return [];
  }
};

// Save events to localStorage
export const saveEvents = (events: Event[]): void => {
  try {
    const eventsJson = JSON.stringify(events);
    localStorage.setItem("events", eventsJson);
  } catch (error) {
    console.error("Error saving events to localStorage:", error);
  }
};

// Add a new event
export const addEvent = (event: Event): void => {
  const events = getEvents();
  events.push(event);
  saveEvents(events);
};

// Delete an event
export const deleteEvent = (id: string): void => {
  const events = getEvents().filter(event => event.id !== id);
  saveEvents(events);
};

// Update an event
export const updateEvent = (updatedEvent: Event): void => {
  const events = getEvents().map(event => 
    event.id === updatedEvent.id ? updatedEvent : event
  );
  saveEvents(events);
};
