/**
 * DEMO MANAGER FULL LAYOUT
 * =========================
 * Sidebar + Main Content Layout
 * LOCKED STRUCTURE - NO CHANGES WITHOUT APPROVAL
 */

import { useState } from "react";
import DemoManagerSidebar from "./DemoManagerSidebar";
import DemoManagerMainContent from "./DemoManagerMainContent";

const DemoManagerFullLayout = () => {
  const [activeView, setActiveView] = useState("live-demo-count");

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <DemoManagerSidebar 
        activeView={activeView} 
        onViewChange={setActiveView} 
      />
      
      {/* Main Content - offset for sidebar */}
      <div className="ml-64">
        <DemoManagerMainContent activeView={activeView} />
      </div>
    </div>
  );
};

export default DemoManagerFullLayout;
