import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Building2, Users, Clock, Calendar, 
  Wallet, TrendingUp, Shield, Settings, Bell, ChevronDown,
  LogOut, Menu, X, UserCog
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface CorporateHRMLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  userRole: 'hr_admin' | 'manager' | 'employee';
  onRoleChange: (role: 'hr_admin' | 'manager' | 'employee') => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['hr_admin', 'manager', 'employee'] },
  { id: 'departments', label: 'Departments & Roles', icon: Building2, roles: ['hr_admin'] },
  { id: 'employees', label: 'Employee Directory', icon: Users, roles: ['hr_admin', 'manager'] },
  { id: 'attendance', label: 'Attendance & Shifts', icon: Clock, roles: ['hr_admin', 'manager', 'employee'] },
  { id: 'leave', label: 'Leave & Policies', icon: Calendar, roles: ['hr_admin', 'manager', 'employee'] },
  { id: 'payroll', label: 'Payroll & Compliance', icon: Wallet, roles: ['hr_admin'] },
  { id: 'performance', label: 'Performance', icon: TrendingUp, roles: ['hr_admin', 'manager'] },
  { id: 'access', label: 'Access Control', icon: Shield, roles: ['hr_admin'] },
  { id: 'settings', label: 'Settings', icon: Settings, roles: ['hr_admin'] },
];

const departments = [
  { id: 'all', name: 'All Departments' },
  { id: 'engineering', name: 'Engineering' },
  { id: 'hr', name: 'Human Resources' },
  { id: 'finance', name: 'Finance' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'sales', name: 'Sales' },
  { id: 'operations', name: 'Operations' },
];

const roleConfig = {
  hr_admin: { label: 'HR Admin', color: 'bg-violet-500' },
  manager: { label: 'Manager', color: 'bg-blue-500' },
  employee: { label: 'Employee', color: 'bg-emerald-500' },
};

export default function CorporateHRMLayout({ 
  children, 
  activeSection, 
  onSectionChange,
  userRole,
  onRoleChange
}: CorporateHRMLayoutProps) {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications] = useState(5);

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={cn(
        "bg-slate-900 text-white flex flex-col transition-all duration-300",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        {/* Logo */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          {isSidebarOpen ? (
            <div>
              <h1 className="text-xl font-bold text-white">Corporate HRM</h1>
              <p className="text-xs text-slate-400">Enterprise Suite</p>
            </div>
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-lg font-bold">C</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                  isActive 
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </motion.button>
            );
          })}
        </nav>

        {/* Role Switcher (Demo) */}
        {isSidebarOpen && (
          <div className="p-3 border-t border-slate-700">
            <p className="text-xs text-slate-500 mb-2 px-2">Demo: Switch View</p>
            <Select value={userRole} onValueChange={(v) => onRoleChange(v as any)}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hr_admin">HR Admin View</SelectItem>
                <SelectItem value="manager">Manager View</SelectItem>
                <SelectItem value="employee">Employee View</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* User */}
        <div className="p-3 border-t border-slate-700">
          <div className={cn(
            "flex items-center gap-3",
            !isSidebarOpen && "justify-center"
          )}>
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center shrink-0">
              <span className="text-sm font-bold">SA</span>
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">System Admin</p>
                <Badge className={cn("text-xs", roleConfig[userRole].color)}>
                  {roleConfig[userRole].label}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 capitalize">
                {activeSection.replace('_', ' ')}
              </h2>
              <p className="text-sm text-slate-500">
                {format(new Date(), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>

            {/* Department Filter */}
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[200px] bg-slate-50 border-slate-200">
                <Building2 className="w-4 h-4 mr-2 text-slate-500" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Button variant="outline" size="icon" className="relative">
              <Bell className="w-5 h-5 text-slate-600" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Button>

            {/* Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">SA</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <UserCog className="w-4 h-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto bg-slate-100">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
