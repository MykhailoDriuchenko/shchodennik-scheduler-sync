
import { supabase } from '@/integrations/supabase/client';
import { Event, fromSupabaseEvent, toSupabaseEvent } from '@/types/event';

export async function getEvents(userId: string): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }

  return data.map(fromSupabaseEvent);
}

export async function addEvent(event: Event, userId: string): Promise<Event | null> {
  const supabaseEvent = toSupabaseEvent(event, userId);
  
  const { data, error } = await supabase
    .from('events')
    .insert(supabaseEvent)
    .select()
    .single();

  if (error) {
    console.error('Error adding event:', error);
    return null;
  }

  return fromSupabaseEvent(data);
}

export async function updateEvent(event: Event, userId: string): Promise<Event | null> {
  const supabaseEvent = toSupabaseEvent(event, userId);
  
  const { data, error } = await supabase
    .from('events')
    .update(supabaseEvent)
    .eq('id', event.id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating event:', error);
    return null;
  }

  return fromSupabaseEvent(data);
}

export async function deleteEvent(eventId: string, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting event:', error);
    return false;
  }

  return true;
}
