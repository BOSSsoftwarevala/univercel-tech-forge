/**
 * DEVELOPER PROJECTS SCREEN
 * Assigned Projects: Active, Waiting, On Hold, Completed
 * LOCK: No modifications without approval
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  Clock,
  Play,
  Pause,
  Send,
  Eye,
  Calendar,
  Tag,
  Layers,
  AlertCircle
} from 'lucide-react';

interface DevProjectsScreenProps {
  view: 'active' | 'waiting' | 'hold' | 'completed';
}

export const DevProjectsScreen: React.FC<DevProjectsScreenProps> = ({ view }) => {
  const projects = {
    active: [
      { id: 1, name: 'E-Commerce Platform v3.0', client: 'TechMart Inc', stack: 'React, Node, PostgreSQL', priority: 'high', deadline: '2024-02-15', progress: 68 },
      { id: 2, name: 'CRM Dashboard Redesign', client: 'SalesForce Pro', stack: 'Vue, Python, MongoDB', priority: 'medium', deadline: '2024-02-20', progress: 45 },
      { id: 3, name: 'Healthcare Portal', client: 'MedCare Solutions', stack: 'React, .NET, SQL Server', priority: 'high', deadline: '2024-02-10', progress: 82 }
    ],
    waiting: [
      { id: 4, name: 'Inventory Management System', client: 'LogiTrack', stack: 'Angular, Java, MySQL', priority: 'medium', deadline: '2024-03-01', progress: 100 },
      { id: 5, name: 'Payment Gateway Integration', client: 'FinTech Corp', stack: 'React, Node, Redis', priority: 'high', deadline: '2024-02-28', progress: 100 }
    ],
    hold: [
      { id: 6, name: 'Social Media Dashboard', client: 'MediaHub', stack: 'React, GraphQL, PostgreSQL', priority: 'low', deadline: 'TBD', progress: 35, holdReason: 'Client review pending' }
    ],
    completed: [
      { id: 7, name: 'Hotel Booking System', client: 'TravelEase', stack: 'React, Node, MongoDB', priority: 'completed', deadline: '2024-01-15', progress: 100 },
      { id: 8, name: 'Learning Management System', client: 'EduTech Pro', stack: 'Vue, Django, PostgreSQL', priority: 'completed', deadline: '2024-01-20', progress: 100 }
    ]
  };

  const currentProjects = projects[view];
  const viewTitles = {
    active: 'Active Projects',
    waiting: 'Waiting Approval',
    hold: 'On Hold',
    completed: 'Completed Projects'
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">{viewTitles[view]}</h1>
        <p className="text-slate-400 text-sm">
          {currentProjects.length} project{currentProjects.length !== 1 ? 's' : ''} in this category
        </p>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {currentProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-5 rounded-xl bg-slate-900/50 border border-slate-700 hover:border-cyan-500/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <FolderKanban className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">{project.name}</h3>
                  <p className="text-sm text-slate-400">{project.client}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(project.priority)}`}>
                {project.priority.toUpperCase()}
              </span>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-400">{project.stack}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-400">{project.deadline}</span>
              </div>
              {view === 'hold' && 'holdReason' in project && (
                <div className="flex items-center gap-2 col-span-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span className="text-sm text-amber-400">{project.holdReason}</span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Progress</span>
                <span className="text-cyan-400 font-medium">{project.progress}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    project.progress === 100
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  }`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {view === 'active' && (
                <>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors text-sm">
                    <Play className="w-4 h-4" />
                    Open
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors text-sm">
                    <Pause className="w-4 h-4" />
                    Pause
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm">
                    <Send className="w-4 h-4" />
                    Submit for Review
                  </button>
                </>
              )}
              {view === 'waiting' && (
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors text-sm">
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              )}
              {view === 'hold' && (
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm">
                  <Play className="w-4 h-4" />
                  Resume
                </button>
              )}
              {view === 'completed' && (
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-500/10 text-slate-400 hover:bg-slate-500/20 transition-colors text-sm">
                  <Eye className="w-4 h-4" />
                  View Archive
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {currentProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderKanban className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No projects in this category</p>
        </div>
      )}
    </div>
  );
};
