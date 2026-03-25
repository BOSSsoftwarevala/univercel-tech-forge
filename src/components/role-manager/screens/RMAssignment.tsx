/**
 * ROLE MANAGER - ROLE ASSIGNMENT SCREEN
 */

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UserPlus,
  Users,
  Building2,
  MapPin,
  Clock,
  Search,
  ArrowRight,
} from "lucide-react";

const USERS_TO_ASSIGN = [
  { id: 1, name: 'John Smith', email: 'john@example.com', currentRole: 'Sales Executive', department: 'Sales' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', currentRole: 'Support Agent', department: 'Support' },
  { id: 3, name: 'Mike Chen', email: 'mike@example.com', currentRole: 'None', department: 'Marketing' },
  { id: 4, name: 'Lisa Brown', email: 'lisa@example.com', currentRole: 'Content Editor', department: 'Marketing' },
  { id: 5, name: 'David Wilson', email: 'david@example.com', currentRole: 'Finance Analyst', department: 'Finance' },
];

const DEPARTMENTS = [
  { id: 'sales', name: 'Sales', users: 45, roles: 5 },
  { id: 'support', name: 'Support', users: 32, roles: 3 },
  { id: 'marketing', name: 'Marketing', users: 18, roles: 4 },
  { id: 'finance', name: 'Finance', users: 12, roles: 3 },
  { id: 'operations', name: 'Operations', users: 28, roles: 6 },
];

const REGIONS = [
  { id: 'north', name: 'North Region', users: 65, countries: 5 },
  { id: 'south', name: 'South Region', users: 48, countries: 4 },
  { id: 'east', name: 'East Region', users: 52, countries: 6 },
  { id: 'west', name: 'West Region', users: 38, countries: 3 },
];

interface RMAssignmentProps {
  activeItem: string;
}

export const RMAssignment = memo<RMAssignmentProps>(({ activeItem }) => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Role Assignment</h1>
          <p className="text-sm text-slate-400">
            {activeItem === 'assign-user' && 'Assign roles to individual users'}
            {activeItem === 'bulk-assignment' && 'Bulk role assignment operations'}
            {activeItem === 'role-department' && 'Department-based role management'}
            {activeItem === 'role-region' && 'Region-based role management'}
            {activeItem === 'temporary-access' && 'Temporary role access management'}
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Assign Role
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Assign to User */}
        <Card className="bg-slate-800/50 border-slate-700 col-span-2">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-400" />
              Assign Role to User
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search users by name or email..." 
                className="bg-slate-900/50 border-slate-600 text-white pl-10"
              />
            </div>
            <div className="space-y-2">
              {USERS_TO_ASSIGN.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <span className="text-blue-400 font-medium">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-sm text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-slate-400 border-slate-600">
                      {user.currentRole}
                    </Badge>
                    <Button size="sm" variant="outline" className="border-blue-500/30 text-blue-400">
                      Assign
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">1,245</p>
                  <p className="text-sm text-slate-400">Users with Roles</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">23</p>
                  <p className="text-sm text-slate-400">Temporary Access</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Department & Region */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-400" />
              By Department
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {DEPARTMENTS.map((dept) => (
                <div
                  key={dept.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-700 hover:border-purple-500/30 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-white font-medium">{dept.name}</p>
                    <p className="text-sm text-slate-400">{dept.users} users • {dept.roles} roles</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              By Region
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {REGIONS.map((region) => (
                <div
                  key={region.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-700 hover:border-cyan-500/30 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-white font-medium">{region.name}</p>
                    <p className="text-sm text-slate-400">{region.users} users • {region.countries} countries</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

RMAssignment.displayName = 'RMAssignment';
