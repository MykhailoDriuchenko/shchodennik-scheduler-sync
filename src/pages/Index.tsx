
import React, { useState, useEffect, useMemo } from "react";
import { EventForm } from "@/components/EventForm";
import { EventList } from "@/components/EventList";
import { Event } from "@/types/event";
import { addEvent, getEvents, deleteEvent, updateEvent } from "@/services/localStorageService";
import { format, addMinutes, isBefore, isToday } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const [events, setEvents] = useState<Event[]>([]);
  
  // Load events from localStorage on component mount
  useEffect(() => {
    setEvents(getEvents());
  }, []);

  // Find upcoming event
  const upcomingEvent = useMemo(() => {
    const now = new Date();
    
    // Filter for upcoming events (events starting today or in the future)
    const upcoming = events.filter((event) => {
      const eventDateTime = new Date(`${format(event.date, 'yyyy-MM-dd')}T${event.startTime}`);
      return !event.completed && (isToday(event.date) || isBefore(now, event.date));
    });
    
    // Sort by date and time
    upcoming.sort((a, b) => {
      const dateA = new Date(`${format(a.date, 'yyyy-MM-dd')}T${a.startTime}`);
      const dateB = new Date(`${format(b.date, 'yyyy-MM-dd')}T${b.startTime}`);
      return dateA.getTime() - dateB.getTime();
    });
    
    // Return the first event (closest upcoming)
    return upcoming.length > 0 ? upcoming[0] : null;
  }, [events]);

  // Check for conflicts when adding a new event
  const checkForConflicts = (newEvent: Event) => {
    const newEventStart = new Date(`${format(newEvent.date, 'yyyy-MM-dd')}T${newEvent.startTime}`);
    const newEventEnd = addMinutes(newEventStart, newEvent.duration);
    
    const conflict = events.find((event) => {
      // Skip comparing with itself (for updates)
      if (event.id === newEvent.id) return false;
      
      // Only check events on the same day
      if (format(event.date, 'yyyy-MM-dd') !== format(newEvent.date, 'yyyy-MM-dd')) return false;
      
      const eventStart = new Date(`${format(event.date, 'yyyy-MM-dd')}T${event.startTime}`);
      const eventEnd = addMinutes(eventStart, event.duration);
      
      // Check if events overlap
      return (
        (newEventStart >= eventStart && newEventStart < eventEnd) || 
        (newEventEnd > eventStart && newEventEnd <= eventEnd) ||
        (newEventStart <= eventStart && newEventEnd >= eventEnd)
      );
    });
    
    return { 
      hasConflict: Boolean(conflict), 
      conflictingEvent: conflict 
    };
  };

  // Add a new event
  const handleAddEvent = (event: Event) => {
    // Generate unique ID
    const newEvent = { ...event, id: Date.now().toString() };
    
    // Add to localStorage
    addEvent(newEvent);
    
    // Update local state
    setEvents(prev => [...prev, newEvent]);
    
    toast({
      title: "Подія додана",
      description: `"${event.title}" було додано до вашого розкладу`,
    });
  };

  // Delete an event
  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
    setEvents(prev => prev.filter(event => event.id !== id));
    
    toast({
      title: "Подію видалено",
      description: "Подію було успішно видалено з вашого розкладу",
    });
  };

  // Reschedule an event (mark as completed)
  const handleRescheduleEvent = (id: string) => {
    const updatedEvents = events.map(event => {
      if (event.id === id) {
        return { ...event, completed: true };
      }
      return event;
    });
    
    // Update in localStorage
    const eventToUpdate = updatedEvents.find(event => event.id === id);
    if (eventToUpdate) {
      updateEvent(eventToUpdate);
    }
    
    // Update local state
    setEvents(updatedEvents);
    
    toast({
      title: "Подію відмічено як виконану",
      description: "Подію було успішно відмічено як виконану",
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-journal-dark mb-6">
          Щоденник - Планувальник Подій
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="sticky top-4">
              <EventForm 
                onAddEvent={handleAddEvent} 
                checkForConflicts={checkForConflicts} 
              />
              
              {upcomingEvent && (
                <Card className="mt-6 border-journal-purple">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Найближча подія:</h3>
                    <p className="font-bold">{upcomingEvent.title}</p>
                    <p className="text-sm text-gray-600">
                      {format(upcomingEvent.date, 'dd.MM.yyyy')} о {upcomingEvent.startTime}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <EventList 
              events={events} 
              onDeleteEvent={handleDeleteEvent} 
              onRescheduleEvent={handleRescheduleEvent}
              upcomingEvent={upcomingEvent}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Index;
