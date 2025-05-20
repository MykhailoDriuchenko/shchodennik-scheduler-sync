
import React from "react";
import { Button } from "@/components/ui/button";
import { format, isToday, isTomorrow, addDays, isBefore, isAfter } from "date-fns";
import { Event } from "@/types/event";
import { Trash2, Calendar, Clock, MapPin, AlertCircle } from "lucide-react";
import { uk } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EventListProps {
  events: Event[];
  onDeleteEvent: (id: string) => void;
  onRescheduleEvent: (id: string) => void;
  upcomingEvent: Event | null;
}

export const EventList: React.FC<EventListProps> = ({
  events,
  onDeleteEvent,
  onRescheduleEvent,
  upcomingEvent,
}) => {
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const dayAfterTomorrow = addDays(today, 2);
  
  const todayEvents = events.filter(event => isToday(event.date));
  const tomorrowEvents = events.filter(event => isTomorrow(event.date));
  const laterEvents = events.filter(
    event => isAfter(event.date, dayAfterTomorrow)
  );
  const pastEvents = events.filter(
    event => isBefore(event.date, today) && !isToday(event.date)
  );

  const renderEvent = (event: Event) => {
    const isPast = isBefore(new Date(`${format(event.date, 'yyyy-MM-dd')}T${event.startTime}`), new Date()) && !event.completed;
    const isUpcoming = upcomingEvent?.id === event.id;
    
    return (
      <Card 
        key={event.id} 
        className={cn(
          "mb-3 relative overflow-hidden",
          isPast ? "border-red-300" : "",
          isUpcoming ? "border-journal-purple border-2" : "",
          event.completed ? "opacity-70" : ""
        )}
      >
        {isUpcoming && (
          <div className="absolute top-0 right-0 m-2">
            <Badge className="bg-journal-purple">Найближча подія</Badge>
          </div>
        )}
        {isPast && !event.completed && (
          <div className="absolute top-0 right-0 m-2">
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> Прострочено
            </Badge>
          </div>
        )}
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-lg">{event.title}</h3>
            <div className="flex space-x-2">
              {isPast && !event.completed && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRescheduleEvent(event.id)}
                >
                  Перепланувати
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteEvent(event.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{format(event.date, 'EEEE, d MMMM', { locale: uk })}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Clock className="h-4 w-4 mr-2" />
            <span>{event.startTime} ({event.duration} хв)</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{event.location}</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="bg-white rounded-md shadow">
      <Tabs defaultValue="today" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="today" className="relative">
            Сьогодні
            {todayEvents.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-journal-purple">
                {todayEvents.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="tomorrow">
            Завтра
            {tomorrowEvents.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-journal-purple">
                {tomorrowEvents.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="later">
            Пізніше
            {laterEvents.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-journal-purple">
                {laterEvents.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="p-4 max-h-[500px] overflow-y-auto">
          {todayEvents.length > 0 ? (
            todayEvents.map(renderEvent)
          ) : (
            <p className="text-center text-gray-500 py-4">Немає подій на сьогодні</p>
          )}
        </TabsContent>

        <TabsContent value="tomorrow" className="p-4 max-h-[500px] overflow-y-auto">
          {tomorrowEvents.length > 0 ? (
            tomorrowEvents.map(renderEvent)
          ) : (
            <p className="text-center text-gray-500 py-4">Немає подій на завтра</p>
          )}
        </TabsContent>

        <TabsContent value="later" className="p-4 max-h-[500px] overflow-y-auto">
          {laterEvents.length > 0 ? (
            laterEvents.map(renderEvent)
          ) : (
            <p className="text-center text-gray-500 py-4">Немає запланованих подій</p>
          )}
        </TabsContent>
      </Tabs>

      {pastEvents.length > 0 && (
        <div className="border-t p-4">
          <h3 className="font-medium text-sm text-gray-500 mb-2">Минулі події ({pastEvents.length})</h3>
          <div className="max-h-[200px] overflow-y-auto">
            {pastEvents.map(renderEvent)}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper for className merging
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
