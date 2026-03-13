import React from 'react';
import { Users, UserPlus, Mail, MoreVertical, Shield } from 'lucide-react';
import { demoStudents, demoTeachers } from '../gcDemoData';

export function GCStudents() {
  const studentColors = ['#1967d2', '#0d904f', '#e37400', '#8430ce', '#d93025', '#137333'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">People</h1>
          <p className="text-sm text-gray-500 mt-1">{demoTeachers.length} teachers, {demoStudents.length} students</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1967d2] text-white rounded-lg hover:bg-[#1557b0] text-sm font-medium">
          <UserPlus className="w-4 h-4" /> Invite
        </button>
      </div>

      {/* Teachers Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 border-b-2 border-[#1967d2] pb-2 mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#1967d2]" /> Teachers
        </h2>
        <div className="space-y-2">
          {demoTeachers.map((t) => (
            <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1967d2] flex items-center justify-center text-white font-medium text-sm">{t.avatar}</div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.subject} • {t.email}</p>
                </div>
              </div>
              <button className="p-1.5 hover:bg-gray-100 rounded-full">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Students Section */}
      <div>
        <div className="flex items-center justify-between border-b-2 border-[#1967d2] pb-2 mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Students</h2>
          <span className="text-sm text-gray-500">{demoStudents.length} students</span>
        </div>
        <div className="space-y-2">
          {demoStudents.map((s, i) => (
            <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm" style={{ backgroundColor: studentColors[i % studentColors.length] }}>
                  {s.avatar}
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{s.name}</p>
                  <p className="text-xs text-gray-500">{s.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 hover:bg-gray-100 rounded-full" title="Email student">
                  <Mail className="w-4 h-4 text-gray-400" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded-full">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}