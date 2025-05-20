
import { EventType } from './supabase';

export interface Event {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  duration: number;
  location: string;
  completed: boolean;
  userId?: string;
}

// Convert Supabase event to our local Event type
export function fromSupabaseEvent(event: EventType): Event {
  return {
    id: event.id,
    title: event.title,
    date: new Date(event.date),
    startTime: event.start_time,
    duration: event.duration,
    location: event.location || '',
    completed: event.completed || false,
    userId: event.user_id
  };
}

// Convert our local Event type to Supabase format
export function toSupabaseEvent(event: Event, userId: string): Omit<EventType, 'id' | 'created_at' | 'updated_at'> {
  return {
    title: event.title,
    date: event.date.toISOString().split('T')[0],
    start_time: event.startTime,
    duration: event.duration,
    location: event.location,
    completed: event.completed,
    user_id: userId
  };
}
