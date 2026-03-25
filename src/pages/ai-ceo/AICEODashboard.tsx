import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AICEOSidebar from "@/components/ai-ceo/AICEOSidebar";
import AICEOHeader from "@/components/ai-ceo/AICEOHeader";

const AICEODashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [streamingOn, setStreamingOn] = useState(true);
  const location = useLocation();

  // Determine active section from route
  const getActiveSection = () => {
    const path = location.pathname.split('/').pop() || 'dashboard';
    return path === 'ai-ceo' ? 'dashboard' : path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a10] via-[#0d0d14] to-[#0a0a10] text-white flex flex-col">
      {/* Fixed Global Header */}
      <AICEOHeader 
        streamingOn={streamingOn}
        onStreamingToggle={() => setStreamingOn(!streamingOn)}
      />

      <div className="flex flex-1 pt-16">
        {/* Left Sidebar */}
        <AICEOSidebar 
          activeSection={getActiveSection()}
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} p-6`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet context={{ streamingOn }} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AICEODashboard;
