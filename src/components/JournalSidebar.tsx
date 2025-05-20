
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  FileText, 
  Settings, 
  PlusCircle
} from "lucide-react";

interface JournalSidebarProps {
  onNewEvent: () => void;
  onViewEvents: () => void;
  currentView: string;
}

export const JournalSidebar: React.FC<JournalSidebarProps> = ({
  onNewEvent,
  onViewEvents,
  currentView
}) => {
  return (
    <div className="w-64 bg-journal-dark text-white p-4 flex flex-col h-full">
      <div className="flex items-center justify-center py-4">
        <h1 className="text-xl font-semibold">Щоденник</h1>
      </div>

      <div className="mt-8 space-y-2">
        <Button
          variant="ghost"
          className={`w-full justify-start text-white hover:bg-white/10 ${
            currentView === "new" ? "bg-white/20" : ""
          }`}
          onClick={onNewEvent}
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Нова подія
        </Button>

        <Button
          variant="ghost"
          className={`w-full justify-start text-white hover:bg-white/10 ${
            currentView === "list" ? "bg-white/20" : ""
          }`}
          onClick={onViewEvents}
        >
          <FileText className="mr-2 h-5 w-5" />
          Список подій
        </Button>

        <Button
          variant="ghost"
          className={`w-full justify-start text-white hover:bg-white/10 ${
            currentView === "calendar" ? "bg-white/20" : ""
          }`}
        >
          <CalendarDays className="mr-2 h-5 w-5" />
          Календар
        </Button>
      </div>

      <div className="mt-auto">
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
          <Settings className="mr-2 h-5 w-5" />
          Налаштування
        </Button>
      </div>
    </div>
  );
};
