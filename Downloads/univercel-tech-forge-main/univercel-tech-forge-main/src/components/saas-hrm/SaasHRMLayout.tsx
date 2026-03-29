import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  Clock,
  Wallet,
  User,
  Shield,
  Settings,
  Bell,
  ChevronDown,
  Plus,
  Check,
  LogOut,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface SaasHRMLayoutProps {
  children: React.ReactNode;
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const modules = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'workspace', icon: Building2, label: 'Workspace' },
  { id: 'attendance', icon: Clock, label: 'Attendance' },
  { id: 'payroll', icon: Wallet, label: 'Payroll' },
  { id: 'self-service', icon: User, label: 'Self Service' },
  { id: 'security', icon: Shield, label: 'Security' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

const workspaces = [
  { id: '1', name: 'Acme Corporation', logo: 'AC', employees: 156 },
  { id: '2', name: 'TechStart Inc', logo: 'TS', employees: 42 },
  { id: '3', name: 'Global Solutions', logo: 'GS', employees: 89 },
];

const SaasHRMLayout: React.FC<SaasHRMLayoutProps> = ({
  children,
  activeModule,
  onModuleChange,
}) => {
  const [currentWorkspace, setCurrentWorkspace] = useState(workspaces[0]);
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex">
      {/* Icon Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-20 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 flex flex-col items-center py-6 fixed h-full z-20"
      >
        {/* Logo */}
        <div className="mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-200">
            <span className="text-white font-bold text-lg">HR</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-2">
          {modules.map((module) => {
            const isActive = activeModule === module.id;
            return (
              <div key={module.id} className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onModuleChange(module.id)}
                  onMouseEnter={() => setHoveredModule(module.id)}
                  onMouseLeave={() => setHoveredModule(null)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-200'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                  }`}
                >
                  <module.icon className="w-5 h-5" />
                </motion.button>

                {/* Tooltip */}
                <AnimatePresence>
                  {hoveredModule === module.id && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap z-50"
                    >
                      {module.label}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* User Avatar */}
        <div className="mt-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-transparent hover:ring-violet-200 transition-all">
                <Avatar className="w-full h-full">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" />
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white">
                    JD
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-56">
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-20">
        {/* Top Header */}
        <header className="h-16 bg-white/60 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-6 sticky top-0 z-10">
          {/* Workspace Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-3 h-10 px-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
                  <span className="text-violet-700 font-semibold text-sm">
                    {currentWorkspace.logo}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-900">{currentWorkspace.name}</p>
                  <p className="text-xs text-slate-500">{currentWorkspace.employees} employees</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72">
              <div className="p-2">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                  Workspaces
                </p>
              </div>
              {workspaces.map((ws) => (
                <DropdownMenuItem
                  key={ws.id}
                  onClick={() => setCurrentWorkspace(ws)}
                  className="py-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mr-3">
                    <span className="text-violet-700 font-semibold text-sm">{ws.logo}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{ws.name}</p>
                    <p className="text-xs text-slate-500">{ws.employees} employees</p>
                  </div>
                  {currentWorkspace.id === ws.id && (
                    <Check className="w-4 h-4 text-violet-600" />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="py-3 text-violet-600">
                <Plus className="w-4 h-4 mr-2" />
                Create New Workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search employees, documents..."
                className="pl-10 bg-slate-50/80 border-slate-200/60 focus:bg-white"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-slate-500" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>

            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-xs text-slate-500">
                {new Date().toLocaleTimeString('en-US', { 
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default SaasHRMLayout;
