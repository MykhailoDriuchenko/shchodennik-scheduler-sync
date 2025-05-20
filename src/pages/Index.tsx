
import React, { useState, useEffect } from "react";
import { JournalSidebar } from "@/components/JournalSidebar";
import { JournalHeader } from "@/components/JournalHeader";
import { EventForm } from "@/components/EventForm";
import { EventList } from "@/components/EventList";
import { Event } from "@/types/event";
import { 
  checkEventConflicts, 
  getUpcomingEvent,
  countAllConflicts
} from "@/lib/events";
import { useToast } from "@/hooks/use-toast";
import { addDays } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getEvents,
  addEvent as addEventToSupabase,
  deleteEvent as deleteEventFromSupabase,
  updateEvent as updateEventInSupabase
} from "@/services/eventService";

const Index = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentView, setCurrentView] = useState<string>("new");
  const [upcomingEvent, setUpcomingEvent] = useState<Event | null>(null);
  const [conflictCount, setConflictCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load events from Supabase on initial render
  useEffect(() => {
    const fetchEvents = async () => {
      if (user) {
        setIsLoading(true);
        const fetchedEvents = await getEvents(user.id);
        setEvents(fetchedEvents);
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, [user]);

  // Check for upcoming events and conflicts when events change
  useEffect(() => {
    if (events.length > 0) {
      // Find next upcoming event
      const next = getUpcomingEvent(events);
      setUpcomingEvent(next);
      
      // Count conflicts
      const conflicts = countAllConflicts(events);
      setConflictCount(conflicts);
    } else {
      setUpcomingEvent(null);
      setConflictCount(0);
    }
  }, [events]);

  const handleAddEvent = async (event: Event) => {
    if (!user) return;
    
    const newEvent = await addEventToSupabase(event, user.id);
    
    if (newEvent) {
      setEvents([...events, newEvent]);
      toast({
        title: "Подію додано",
        description: `${event.title} на ${event.startTime}`,
      });
      setCurrentView("list");
    } else {
      toast({
        title: "Помилка",
        description: "Не вдалося додати подію",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!user) return;
    
    const success = await deleteEventFromSupabase(id, user.id);
    
    if (success) {
      setEvents(events.filter(event => event.id !== id));
      toast({
        title: "Подію видалено",
      });
    } else {
      toast({
        title: "Помилка",
        description: "Не вдалося видалити подію",
        variant: "destructive"
      });
    }
  };

  const handleRescheduleEvent = async (id: string) => {
    if (!user) return;
    
    // Find the event to reschedule
    const eventToReschedule = events.find(event => event.id === id);
    
    if (eventToReschedule) {
      // Create a new event tomorrow at the same time
      const rescheduledEvent: Event = {
        ...eventToReschedule,
        id: Date.now().toString(), // New ID for the new event
        date: addDays(new Date(), 1), // Set date to tomorrow
      };
      
      const newEvent = await addEventToSupabase(rescheduledEvent, user.id);
      const success = await deleteEventFromSupabase(id, user.id);
      
      if (newEvent && success) {
        setEvents([...events.filter(event => event.id !== id), newEvent]);
        
        toast({
          title: "Подію перенесено",
          description: `${eventToReschedule.title} перенесено на завтра`,
        });
      } else {
        toast({
          title: "Помилка",
          description: "Не вдалося перенести подію",
          variant: "destructive"
        });
      }
    }
  };

  const handleSignOut = async () => {
    // This will be implemented in JournalSidebar
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <p>Завантаження...</p>
    </div>;
  }

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
