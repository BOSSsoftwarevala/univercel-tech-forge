import React, { useState } from 'react';
import { Settings, Bell, Shield, Palette, Globe, Clock, ChevronRight, ToggleLeft, ToggleRight } from 'lucide-react';

export function GCSettings() {
  const [toggles, setToggles] = useState({
    emailNotif: true,
    pushNotif: true,
    darkMode: false,
    autoGrade: true,
    parentAccess: true,
  });

  const toggle = (key: keyof typeof toggles) => setToggles(p => ({ ...p, [key]: !p[key] }));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2"><Bell className="w-4 h-4" /> Notifications</h3>
        </div>
        <div className="divide-y divide-gray-100">
          <SettingToggle label="Email Notifications" desc="Receive email alerts for new submissions and announcements" value={toggles.emailNotif} onToggle={() => toggle('emailNotif')} />
          <SettingToggle label="Push Notifications" desc="Browser push notifications for real-time updates" value={toggles.pushNotif} onToggle={() => toggle('pushNotif')} />
        </div>
      </div>

      {/* Classroom */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2"><Settings className="w-4 h-4" /> Classroom Settings</h3>
        </div>
        <div className="divide-y divide-gray-100">
          <SettingToggle label="Auto-Grade Quizzes" desc="Automatically grade multiple choice quizzes on submission" value={toggles.autoGrade} onToggle={() => toggle('autoGrade')} />
          <SettingToggle label="Parent Portal Access" desc="Allow parents to view grades and attendance" value={toggles.parentAccess} onToggle={() => toggle('parentAccess')} />
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2"><Palette className="w-4 h-4" /> Appearance</h3>
        </div>
        <div className="divide-y divide-gray-100">
          <SettingToggle label="Dark Mode" desc="Switch to dark theme for better visibility at night" value={toggles.darkMode} onToggle={() => toggle('darkMode')} />
          <SettingRow icon={Globe} label="Language" value="English (India)" />
          <SettingRow icon={Clock} label="Timezone" value="IST (UTC+5:30)" />
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2"><Shield className="w-4 h-4" /> Security & Privacy</h3>
        </div>
        <div className="divide-y divide-gray-100">
          <SettingRow icon={Shield} label="Two-Factor Authentication" value="Enabled" />
          <SettingRow icon={Shield} label="Login History" value="View" />
          <SettingRow icon={Shield} label="Data Export" value="Request" />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-400">Software Vala Classroom v2.0 • Enterprise Edition</p>
      </div>
    </div>
  );
}

function SettingToggle({ label, desc, value, onToggle }: { label: string; desc: string; value: boolean; onToggle: () => void }) {
  return (
    <div className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50" onClick={onToggle}>
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      {value ? <ToggleRight className="w-6 h-6 text-[#1967d2]" /> : <ToggleLeft className="w-6 h-6 text-gray-300" />}
    </div>
  );
}

function SettingRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <p className="text-sm font-medium text-gray-800">{label}</p>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>{value}</span>
        <ChevronRight className="w-4 h-4 text-gray-300" />
      </div>
    </div>
  );
}