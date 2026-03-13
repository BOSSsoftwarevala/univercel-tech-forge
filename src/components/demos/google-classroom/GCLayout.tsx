import React, { useState } from 'react';
import { GCSidebar } from './GCSidebar';
import { GCDashboard } from './screens/GCDashboard';
import { GCClassrooms } from './screens/GCClassrooms';
import { GCAssignments } from './screens/GCAssignments';
import { GCGradebook } from './screens/GCGradebook';
import { GCAnnouncements } from './screens/GCAnnouncements';
import { GCStudents } from './screens/GCStudents';
import { GCSettings } from './screens/GCSettings';
import { Menu } from 'lucide-react';

export type GCScreen = 'dashboard' | 'classrooms' | 'assignments' | 'gradebook' | 'announcements' | 'students' | 'settings';

export function GCLayout() {
  const [activeScreen, setActiveScreen] = useState<GCScreen>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard': return <GCDashboard onNavigate={setActiveScreen} />;
      case 'classrooms': return <GCClassrooms />;
      case 'assignments': return <GCAssignments />;
      case 'gradebook': return <GCGradebook />;
      case 'announcements': return <GCAnnouncements />;
      case 'students': return <GCStudents />;
      case 'settings': return <GCSettings />;
      default: return <GCDashboard onNavigate={setActiveScreen} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f9fa] overflow-hidden">
      {sidebarOpen && (
        <GCSidebar activeScreen={activeScreen} onScreenChange={setActiveScreen} onClose={() => setSidebarOpen(false)} />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 gap-4 shrink-0">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-full">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#1967d2] flex items-center justify-center">
              <span className="text-white font-bold text-sm">SV</span>
            </div>
            <div>
              <h1 className="text-base font-medium text-gray-800">Software Vala Classroom</h1>
              <p className="text-xs text-gray-500">School Management System</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1967d2] flex items-center justify-center text-white text-sm font-medium">
              A
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
}
