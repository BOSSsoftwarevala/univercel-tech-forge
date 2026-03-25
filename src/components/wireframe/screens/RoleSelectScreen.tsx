import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Crown, Shield, Building2, Users, Code2, Megaphone, Headphones,
  Star, Target, ListTodo, Search, Lightbulb, HeartHandshake,
  TrendingUp, Wallet, Scale, UserPlus, Sparkles, Play, BarChart3,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const roles = [
  { id: 'boss_owner', name: 'Boss Owner', icon: Crown, color: 'from-red-500 to-orange-500', description: 'Supreme system authority', tier: 'admin' },
  { id: 'admin', name: 'Admin', icon: Shield, color: 'from-orange-500 to-amber-500', description: 'Administrative operations', tier: 'admin' },
  { id: 'ceo', name: 'CEO', icon: Crown, color: 'from-amber-500 to-yellow-500', description: 'Executive oversight', tier: 'admin' },
  { id: 'server_manager', name: 'Server Manager', icon: Package, color: 'from-slate-500 to-slate-700', description: 'Infrastructure overview & tooling', tier: 'admin' },
  { id: 'franchise', name: 'Franchise', icon: Building2, color: 'from-blue-500 to-cyan-500', description: 'Territory and reseller management', tier: 'partner' },
  { id: 'reseller', name: 'Reseller', icon: Users, color: 'from-cyan-500 to-teal-500', description: 'Lead conversion and sales', tier: 'partner' },
  { id: 'developer', name: 'Developer', icon: Code2, color: 'from-purple-500 to-violet-500', description: 'Task execution and delivery', tier: 'user' },
  { id: 'sales', name: 'Sales', icon: Megaphone, color: 'from-green-500 to-emerald-500', description: 'Direct sales operations', tier: 'user' },
  { id: 'support', name: 'Support', icon: Headphones, color: 'from-sky-500 to-blue-500', description: 'Customer support tickets', tier: 'user' },
  { id: 'prime', name: 'Prime User', icon: Star, color: 'from-amber-500 to-yellow-500', description: 'Premium client access', tier: 'user' },
  { id: 'lead_manager', name: 'Lead Manager', icon: Target, color: 'from-teal-500 to-cyan-500', description: 'Lead assignment and tracking', tier: 'manager' },
  { id: 'task_manager', name: 'Task Manager', icon: ListTodo, color: 'from-indigo-500 to-purple-500', description: 'Developer task allocation', tier: 'manager' },
  { id: 'seo_manager', name: 'SEO Manager', icon: Search, color: 'from-emerald-500 to-green-500', description: 'Search optimization', tier: 'manager' },
  { id: 'rnd', name: 'R&D', icon: Lightbulb, color: 'from-sky-400 to-blue-500', description: 'Research and development', tier: 'manager' },
  { id: 'client_success', name: 'Client Success', icon: HeartHandshake, color: 'from-pink-500 to-rose-500', description: 'Client satisfaction', tier: 'manager' },
  { id: 'performance', name: 'Performance Manager', icon: TrendingUp, color: 'from-rose-500 to-red-500', description: 'Team performance tracking', tier: 'manager' },
  { id: 'finance', name: 'Finance Manager', icon: Wallet, color: 'from-lime-500 to-green-500', description: 'Financial operations', tier: 'manager' },
  { id: 'legal', name: 'Legal & Compliance', icon: Scale, color: 'from-stone-500 to-gray-500', description: 'Legal documentation', tier: 'manager' },
  { id: 'hr', name: 'HR/Hiring', icon: UserPlus, color: 'from-orange-400 to-amber-500', description: 'Recruitment management', tier: 'manager' },
  { id: 'influencer', name: 'Influencer', icon: Sparkles, color: 'from-fuchsia-500 to-pink-500', description: 'Marketing partnerships', tier: 'partner' },
  { id: 'demo_manager', name: 'Demo Manager', icon: Play, color: 'from-violet-500 to-purple-500', description: 'Demo system management', tier: 'manager' },
  { id: 'marketing', name: 'Marketing Manager', icon: BarChart3, color: 'from-pink-400 to-rose-500', description: 'Campaign management', tier: 'manager' },
  { id: 'products', name: 'Product Manager', icon: Package, color: 'from-blue-400 to-indigo-500', description: 'Product library', tier: 'manager' },
];

export function RoleSelectScreen() {
  const navigate = useNavigate();
  const isDark = true;

  const tierColors = {
    admin: 'border-red-500/30 bg-red-500/10',
    manager: 'border-purple-500/30 bg-purple-500/10',
    partner: 'border-cyan-500/30 bg-cyan-500/10',
    user: 'border-emerald-500/30 bg-emerald-500/10',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Select Your Role
        </h1>
        <p className="text-muted-foreground mt-2">Choose a role to access the dashboard</p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <Input placeholder="Search roles..." className="text-center" />
      </div>

      {/* Tier Legend */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {Object.entries({ admin: 'Admin', manager: 'Manager', partner: 'Partner', user: 'User' }).map(([key, label]) => (
          <Badge key={key} variant="outline" className={tierColors[key as keyof typeof tierColors]}>
            {label}
          </Badge>
        ))}
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className={`group relative p-4 rounded-xl border cursor-pointer transition-all hover:scale-105 hover:shadow-xl ${
              isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
            } ${tierColors[role.tier as keyof typeof tierColors]}`}
            onClick={() => navigate(`/wireframe/${role.id.replace(/_/g, '-')}`)}
          >
            {/* Icon */}
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <role.icon className="h-6 w-6 text-white" />
            </div>

            {/* Content */}
            <h3 className="font-semibold mb-1">{role.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">{role.description}</p>

            {/* Tier Badge */}
            <Badge variant="outline" className="mt-3 text-[10px] uppercase">
              {role.tier}
            </Badge>

            {/* Hover Arrow */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-lg">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
