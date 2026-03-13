import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BookOpen, ClipboardList, Users, TrendingUp, Plus, Clock, Bell } from 'lucide-react';
import { demoClassrooms, demoAssignments, demoAnnouncements, demoClassMembers } from '../gcDemoData';
import type { GCScreen } from '../GCLayout';

interface GCDashboardProps {
  onNavigate: (screen: GCScreen) => void;
}

export function GCDashboard({ onNavigate }: GCDashboardProps) {
  const [stats, setStats] = useState({ classrooms: 6, assignments: 8, submissions: 47, students: 175 });
  const [recentClasses, setRecentClasses] = useState<any[]>(demoClassrooms.slice(0, 6));
  const [recentAnnouncements] = useState(demoAnnouncements.slice(0, 3));

  useEffect(() => {
    loadRealData();
  }, []);

  const loadRealData = async () => {
    try {
      const [c, a] = await Promise.all([
        supabase.from('gc_classrooms').select('*').eq('is_archived', false).order('created_at', { ascending: false }).limit(6),
        supabase.from('gc_assignments').select('id', { count: 'exact', head: true }),
      ]);
      if (c.data && c.data.length > 0) {
        setRecentClasses(c.data);
        setStats(prev => ({ ...prev, classrooms: c.data!.length, assignments: a.count || prev.assignments }));
      }
    } catch {}
  };

  const kpis = [
    { label: 'Classrooms', value: stats.classrooms, icon: BookOpen, color: '#1967d2', bg: '#e8f0fe' },
    { label: 'Assignments', value: stats.assignments, icon: ClipboardList, color: '#e37400', bg: '#fef3e0' },
    { label: 'Submissions', value: stats.submissions, icon: TrendingUp, color: '#0d904f', bg: '#e6f4ea' },
    { label: 'Students', value: stats.students, icon: Users, color: '#8430ce', bg: '#f3e8fd' },
  ];

  const classColors = ['#1967d2', '#0d904f', '#e37400', '#8430ce', '#d93025', '#137333'];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Welcome back, Teacher</h1>
          <p className="text-gray-500 text-sm mt-1">Here's what's happening in your school today</p>
        </div>
        <button 
          onClick={() => onNavigate('classrooms')}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1967d2] text-white rounded-lg hover:bg-[#1557b0] transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Create Class
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate(kpi.label.toLowerCase() as GCScreen)}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: kpi.bg }}>
                  <Icon className="w-5 h-5" style={{ color: kpi.color }} />
                </div>
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{kpi.value}</p>
              <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Announcements */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><Bell className="w-5 h-5 text-[#1967d2]" /> Recent Updates</h2>
          <button onClick={() => onNavigate('announcements')} className="text-sm text-[#1967d2] hover:underline">View all</button>
        </div>
        <div className="space-y-3">
          {recentAnnouncements.map((a) => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1967d2] flex items-center justify-center text-white text-xs font-medium shrink-0">
                  {a.author_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800 text-sm">{a.author_name}</span>
                    <span className="text-xs text-gray-400">• {a.classroom_name}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{a.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your Classrooms */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Your Classrooms</h2>
          <button onClick={() => onNavigate('classrooms')} className="text-sm text-[#1967d2] hover:underline">View all</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentClasses.map((cls, i) => {
            const members = demoClassMembers[cls.id] || { students: 0, teachers: 1 };
            return (
              <div key={cls.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="h-24 p-4 flex flex-col justify-end relative" style={{ backgroundColor: classColors[i % classColors.length] }}>
                  <h3 className="text-white font-semibold text-lg truncate">{cls.name}</h3>
                  <p className="text-white/80 text-sm truncate">{cls.section || cls.subject || 'No section'}</p>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {members.students} students</span>
                      <span className="flex items-center gap-1"><ClipboardList className="w-3.5 h-3.5" /> {demoAssignments.filter(a => a.classroom_id === cls.id).length} work</span>
                    </div>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {cls.class_code}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}