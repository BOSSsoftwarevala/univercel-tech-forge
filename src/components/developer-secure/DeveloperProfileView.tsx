import React, { useState } from 'react';
import { 
  User, Shield, Code2, Star, Clock, CheckCircle,
  Award, Calendar, Mail, Phone, MapPin, Edit
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DeveloperProfile } from '@/hooks/useDeveloperGuard';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface DeveloperProfileViewProps {
  profile: DeveloperProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DeveloperProfileView({
  profile,
  isOpen,
  onClose
}: DeveloperProfileViewProps) {
  if (!profile) return null;

  const stats = [
    { label: 'Tasks Completed', value: profile.total_tasks_completed, icon: CheckCircle, color: 'text-emerald-500' },
    { label: 'Performance', value: `${profile.performance_score}%`, icon: Star, color: 'text-amber-500' },
    { label: 'SLA Compliance', value: `${profile.sla_compliance_rate}%`, icon: Clock, color: 'text-cyan-500' },
    { label: 'Active Tasks', value: profile.current_active_tasks, icon: Code2, color: 'text-purple-500' },
  ];

  const getExpertiseBadge = () => {
    switch (profile.expertise_level) {
      case 'senior':
        return { bg: 'bg-purple-500', label: 'Senior Developer' };
      case 'mid':
        return { bg: 'bg-cyan-500', label: 'Mid-Level Developer' };
      case 'junior':
      default:
        return { bg: 'bg-emerald-500', label: 'Junior Developer' };
    }
  };

  const expertiseConfig = getExpertiseBadge();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md bg-slate-900 border-slate-800 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white">Developer Profile</SheetTitle>
          <SheetDescription>Your account details and performance</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Profile Header */}
          <div className="text-center">
            <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center mb-4">
              <User className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">{profile.full_name_masked}</h3>
            <Badge variant="outline" className="mt-2">{profile.developer_id}</Badge>
            <Badge className={`ml-2 ${expertiseConfig.bg}`}>{expertiseConfig.label}</Badge>
          </div>

          {/* Status */}
          <div className={`p-4 rounded-lg text-center ${
            profile.status === 'active' ? 'bg-emerald-500/10 border border-emerald-500/30' :
            profile.status === 'pending' ? 'bg-amber-500/10 border border-amber-500/30' :
            'bg-red-500/10 border border-red-500/30'
          }`}>
            <p className="text-sm text-muted-foreground">Account Status</p>
            <p className={`text-lg font-bold ${
              profile.status === 'active' ? 'text-emerald-500' :
              profile.status === 'pending' ? 'text-amber-500' :
              'text-red-500'
            }`}>
              {profile.status.toUpperCase()}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-cyan-500" />
              Primary Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.primary_skills.length > 0 ? (
                profile.primary_skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="bg-cyan-500/10">
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No skills listed</span>
              )}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white">Performance Metrics</h4>
            
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Code Quality</span>
                  <span className="text-emerald-500">94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Speed</span>
                  <span className="text-cyan-500">87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Communication</span>
                  <span className="text-purple-500">91%</span>
                </div>
                <Progress value={91} className="h-2" />
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Account Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Member since: {new Date(profile.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-cyan-500" />
              <span className="text-sm font-semibold text-white">Security Mode</span>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• All actions are logged</li>
              <li>• No admin access permitted</li>
              <li>• Execution-only permissions</li>
              <li>• Session timeout: 30 minutes</li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
