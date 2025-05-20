
import React from "react";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { Bell } from "lucide-react";
import { Event } from "@/types/event";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface JournalHeaderProps {
  upcomingEvent: Event | null;
  conflictCount: number;
}

export const JournalHeader: React.FC<JournalHeaderProps> = ({
  upcomingEvent,
  conflictCount
}) => {
  const today = new Date();
  const formattedDate = format(today, "EEEE, d MMMM yyyy", { locale: uk });

  return (
    <div className="bg-white border-b p-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-journal-dark">Щоденник</h1>
        <p className="text-journal-gray">{formattedDate}</p>
      </div>

      <div className="flex items-center space-x-4">
        {upcomingEvent && (
          <div className="hidden md:block">
            <p className="text-sm text-journal-gray">Найближча подія:</p>
            <p className="font-medium">{upcomingEvent.title} о {upcomingEvent.startTime}</p>
          </div>
        )}

        <Popover>
          <PopoverTrigger asChild>
            <button className="relative">
              <Bell className="h-6 w-6 text-journal-dark" />
              {(conflictCount > 0) && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                  {conflictCount}
                </Badge>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="font-medium">Сповіщення</div>
              {conflictCount > 0 ? (
                <div className="text-sm bg-red-50 p-2 rounded border border-red-100">
                  <p className="font-medium text-red-800">Виявлено {conflictCount} конфліктів у розкладі</p>
                  <p className="text-red-600">Будь ласка, перегляньте свій розклад і внесіть зміни.</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Немає сповіщень</p>
              )}
              
              {upcomingEvent && (
                <div className="text-sm bg-blue-50 p-2 rounded border border-blue-100">
                  <p className="font-medium">Нагадування:</p>
                  <p>{upcomingEvent.title}</p>
                  <p>Сьогодні о {upcomingEvent.startTime} ({upcomingEvent.location})</p>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
