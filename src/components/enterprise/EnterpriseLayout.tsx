import { Outlet } from "react-router-dom";
import { GlobalHeader } from "./GlobalHeader";
import { GlobalSidebar } from "./GlobalSidebar";
import { GlobalFooter } from "./GlobalFooter";
import { AIChatbot } from "./AIChatbot";
import { TooltipProvider } from "@/components/ui/tooltip";

interface EnterpriseLayoutProps {
  userRole?: string;
}

export function EnterpriseLayout({ userRole = "boss_owner" }: EnterpriseLayoutProps) {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[hsl(var(--sv-navy-deep))]">
        <GlobalHeader 
          userRole={userRole}
          walletBalance={125000}
          notificationCount={5}
          buzzerActive={true}
          maskedUserId="USR-****-7X9K"
          isDeveloper={userRole === "developer"}
        />
        
        <div className="flex">
          <GlobalSidebar userRole={userRole} />
          
          <main className="flex-1 min-h-[calc(100vh-64px)] overflow-auto">
            <div className="p-6">
              <Outlet />
            </div>
            <GlobalFooter />
          </main>
        </div>
        
        <AIChatbot />
      </div>
    </TooltipProvider>
  );
}
