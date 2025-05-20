
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Event } from "@/types/event";

interface EventFormProps {
  onAddEvent: (event: Event) => void;
  checkForConflicts: (event: Event) => { hasConflict: boolean; conflictingEvent?: Event };
}

export const EventForm: React.FC<EventFormProps> = ({ onAddEvent, checkForConflicts }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !date || !startTime || !duration || !location) {
      setError("Будь ласка, заповніть всі поля");
      return;
    }

    const newEvent: Event = {
      id: Date.now().toString(),
      title,
      date: date!,
      startTime,
      duration: parseInt(duration, 10),
      location,
      completed: false,
    };

    // Check for conflicts
    const { hasConflict, conflictingEvent } = checkForConflicts(newEvent);
    
    if (hasConflict && conflictingEvent) {
      setError(`Конфлікт з подією "${conflictingEvent.title}" о ${conflictingEvent.startTime}`);
      return;
    }

    onAddEvent(newEvent);
    
    // Reset form
    setTitle("");
    setStartTime("");
    setDuration("");
    setLocation("");
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-md shadow">
      <h2 className="text-xl font-semibold text-journal-dark mb-4">Нова подія</h2>
      
      {error && (
        <div className="bg-red-100 text-red-800 p-2 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Заголовок</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Назва події"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Дата</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Виберіть дату</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Час початку</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration">Тривалість (хв)</Label>
          <Input
            id="duration"
            type="number"
            min="5"
            step="5"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="60"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Місце проведення</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-9"
            placeholder="Локація"
          />
        </div>
      </div>

      <Button type="submit" className="w-full bg-journal-purple hover:bg-journal-purple/90">
        Додати подію
      </Button>
    </form>
  );
};
