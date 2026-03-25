/**
 * DEMO MANAGER FULL LAYOUT
 * =========================
 * Sidebar + Main Content Layout
 * LOCKED STRUCTURE - NO CHANGES WITHOUT APPROVAL
 */

import { useState, useCallback } from "react";
import DemoManagerSidebar from "./DemoManagerSidebar";
import DemoManagerMainContent from "./DemoManagerMainContent";

const DemoManagerFullLayout = () => {
  const [activeView, setActiveView] = useState("live-demo-count");

  // Memoized handler to ensure state updates properly
  const handleViewChange = useCallback((view: string) => {
    setActiveView(view);
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Fixed width, not position:fixed to avoid z-index issues */}
      <div className="w-64 flex-shrink-0">
        <DemoManagerSidebar 
          activeView={activeView} 
          onViewChange={handleViewChange} 
        />
      </div>
      
      {/* Main Content - Flex grow to fill remaining space */}
      <div className="flex-1 min-w-0">
        <DemoManagerMainContent activeView={activeView} />
      </div>
    </div>
  );
};

export default DemoManagerFullLayout;
