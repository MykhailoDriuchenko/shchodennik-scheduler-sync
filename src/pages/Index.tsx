
import React, { useState, useEffect } from "react";
import { JournalSidebar } from "@/components/JournalSidebar";
import { JournalHeader } from "@/components/JournalHeader";
import { EventForm } from "@/components/EventForm";
import { EventList } from "@/components/EventList";
import { Event } from "@/types/event";
import { 
  loadEvents, 
  saveEvents, 
  checkEventConflicts, 
  getUpcomingEvent,
  countAllConflicts
} from "@/lib/events";
import { useToast } from "@/hooks/use-toast";
import { addDays } from "date-fns";

const Index = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentView, setCurrentView] = useState<string>("new");
  const [upcomingEvent, setUpcomingEvent] = useState<Event | null>(null);
  const [conflictCount, setConflictCount] = useState<number>(0);
  const { toast } = useToast();

  // Load events on initial render
  useEffect(() => {
    const savedEvents = loadEvents();
    setEvents(savedEvents);
  }, []);

  // Check for upcoming events and conflicts when events change
  useEffect(() => {
    if (events.length > 0) {
      // Find next upcoming event
      const next = getUpcomingEvent(events);
      setUpcomingEvent(next);
      
      // Count conflicts
      const conflicts = countAllConflicts(events);
      setConflictCount(conflicts);
      
      // Save to local storage
      saveEvents(events);
    } else {
      setUpcomingEvent(null);
      setConflictCount(0);
    }
  }, [events]);

  const handleAddEvent = (event: Event) => {
    setEvents([...events, event]);
    toast({
      title: "Подію додано",
      description: `${event.title} на ${event.startTime}`,
    });
    setCurrentView("list");
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
    toast({
      title: "Подію видалено",
    });
  };

  const handleRescheduleEvent = (id: string) => {
    // Find the event to reschedule
    const eventToReschedule = events.find(event => event.id === id);
    
    if (eventToReschedule) {
      // Create a new event tomorrow at the same time
      const rescheduledEvent: Event = {
        ...eventToReschedule,
        id: Date.now().toString(), // New ID for the new event
        date: addDays(new Date(), 1), // Set date to tomorrow
      };
      
      setEvents([...events.filter(event => event.id !== id), rescheduledEvent]);
      
      toast({
        title: "Подію перенесено",
        description: `${eventToReschedule.title} перенесено на завтра`,
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-journal-light">
      <JournalSidebar 
        onNewEvent={() => setCurrentView("new")}
        onViewEvents={() => setCurrentView("list")}
        currentView={currentView}
      />
      
      <div className="flex-1 flex flex-col">
        <JournalHeader 
          upcomingEvent={upcomingEvent}
          conflictCount={conflictCount}
        />
        
        <div className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            {currentView === "new" ? (
              <EventForm 
                onAddEvent={handleAddEvent} 
                checkForConflicts={(event) => checkEventConflicts(events, event)}
              />
            ) : (
              <EventList 
                events={events} 
                onDeleteEvent={handleDeleteEvent}
                onRescheduleEvent={handleRescheduleEvent}
                upcomingEvent={upcomingEvent}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
