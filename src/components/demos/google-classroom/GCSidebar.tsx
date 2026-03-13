import React from 'react';
import { 
  LayoutDashboard, BookOpen, ClipboardList, BarChart3, 
  Megaphone, Users, Settings, X, GraduationCap 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GCScreen } from './GCLayout';

interface GCSidebarProps {
  activeScreen: GCScreen;
  onScreenChange: (screen: GCScreen) => void;
  onClose: () => void;
}

const menuItems: { id: GCScreen; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'classrooms', label: 'Classrooms', icon: BookOpen },
  { id: 'assignments', label: 'Assignments', icon: ClipboardList },
  { id: 'gradebook', label: 'Gradebook', icon: BarChart3 },
  { id: 'announcements', label: 'Stream', icon: Megaphone },
  { id: 'students', label: 'People', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function GCSidebar({ activeScreen, onScreenChange, onClose }: GCSidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-[#1967d2]" />
          <span className="font-semibold text-gray-800">Classroom</span>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onScreenChange(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors text-sm',
                isActive
                  ? 'bg-[#e8f0fe] text-[#1967d2] font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-400 text-center">
          Powered by Software Vala
        </div>
      </div>
    </div>
  );
}
