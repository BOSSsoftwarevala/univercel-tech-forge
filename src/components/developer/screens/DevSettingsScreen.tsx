/**
 * DEVELOPER SETTINGS SCREEN
 * Skill Tags, Availability, Access Scope
 * LOCK: No modifications without approval
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Tag,
  Clock,
  Shield,
  Save,
  Eye
} from 'lucide-react';

export const DevSettingsScreen: React.FC = () => {
  const [availability, setAvailability] = useState('available');

  const skillTags = [
    { name: 'React', level: 'expert' },
    { name: 'TypeScript', level: 'expert' },
    { name: 'Node.js', level: 'advanced' },
    { name: 'PostgreSQL', level: 'advanced' },
    { name: 'Python', level: 'intermediate' },
    { name: 'Docker', level: 'intermediate' },
    { name: 'AWS', level: 'intermediate' }
  ];

  const accessScopes = [
    { name: 'Source Code', access: 'read-only', description: 'View and edit assigned project code' },
    { name: 'Database', access: 'read-only', description: 'Query assigned project databases' },
    { name: 'Deployments', access: 'write', description: 'Deploy to staging environments' },
    { name: 'Production', access: 'restricted', description: 'Requires approval for production deploys' },
    { name: 'Logs', access: 'read-only', description: 'View build and runtime logs' },
    { name: 'Settings', access: 'restricted', description: 'Limited to personal settings only' }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'advanced': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'intermediate': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getAccessColor = (access: string) => {
    switch (access) {
      case 'write': return 'text-emerald-400';
      case 'read-only': return 'text-cyan-400';
      case 'restricted': return 'text-amber-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings & Access</h1>
        <p className="text-slate-400 text-sm">Manage your profile and permissions</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skill Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl bg-slate-900/50 border border-slate-700"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Tag className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Skill Tags</h3>
              <p className="text-xs text-slate-400">Your technical expertise</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {skillTags.map((skill) => (
              <div
                key={skill.name}
                className={`px-3 py-1.5 rounded-lg border text-sm ${getLevelColor(skill.level)}`}
              >
                {skill.name}
                <span className="ml-2 text-xs opacity-70">{skill.level}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500 mt-4">
            Skills are managed by your team lead. Contact them to update.
          </p>
        </motion.div>

        {/* Availability */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-xl bg-slate-900/50 border border-slate-700"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Clock className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Availability</h3>
              <p className="text-xs text-slate-400">Set your current status</p>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { value: 'available', label: 'Available', color: 'emerald' },
              { value: 'busy', label: 'Busy', color: 'amber' },
              { value: 'away', label: 'Away', color: 'slate' },
              { value: 'dnd', label: 'Do Not Disturb', color: 'red' }
            ].map((status) => (
              <button
                key={status.value}
                onClick={() => setAvailability(status.value)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  availability === status.value
                    ? `bg-${status.color}-500/10 border-${status.color}-500/30`
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full bg-${status.color}-500`} />
                  <span className={`text-sm ${availability === status.value ? 'text-white' : 'text-slate-400'}`}>
                    {status.label}
                  </span>
                </div>
                {availability === status.value && (
                  <span className="text-xs text-emerald-400">Active</span>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Access Scope */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-5 rounded-xl bg-slate-900/50 border border-slate-700"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Access Scope</h3>
            <p className="text-xs text-slate-400">Your permissions (read-only)</p>
          </div>
        </div>

        <div className="space-y-3">
          {accessScopes.map((scope) => (
            <div
              key={scope.name}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700"
            >
              <div>
                <p className="text-sm text-white">{scope.name}</p>
                <p className="text-xs text-slate-500">{scope.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Eye className={`w-4 h-4 ${getAccessColor(scope.access)}`} />
                <span className={`text-xs font-medium ${getAccessColor(scope.access)}`}>
                  {scope.access.replace('-', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-500 mt-4">
          Access permissions are managed by system administrators.
        </p>
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition-colors">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
};
