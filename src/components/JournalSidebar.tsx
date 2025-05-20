
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  FileText, 
  Settings, 
  PlusCircle,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    
    if (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося вийти з системи",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Вихід із системи",
        description: "Ви успішно вийшли з системи",
      });
      navigate('/auth');
    }
  };

  return (
    <div className="w-64 bg-journal-dark text-white p-4 flex flex-col h-full">
      <div className="flex items-center justify-center py-4">
        <h1 className="text-xl font-semibold">Щоденник</h1>
      </div>

      {user && (
        <div className="mt-2 mb-6 px-4 py-2 bg-white/10 rounded-md">
          <p className="text-sm text-white/80">Вітаємо,</p>
          <p className="font-medium truncate">{user.email}</p>
        </div>
      )}

      <div className="mt-4 space-y-2">
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

      <div className="mt-auto space-y-2">
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
          <Settings className="mr-2 h-5 w-5" />
          Налаштування
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-white hover:bg-white/10 hover:bg-red-900/20"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Вийти
        </Button>
      </div>
    </div>
  );
};
