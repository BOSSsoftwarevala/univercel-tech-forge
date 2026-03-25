import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Plus,
  Users,
  Mail,
  Settings,
  MoreVertical,
  ExternalLink,
  Copy,
  Trash2,
  Edit,
  UserPlus,
  Globe,
  Shield,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const organizations = [
  {
    id: '1',
    name: 'Acme Corporation',
    domain: 'acme.com',
    employees: 156,
    departments: 8,
    plan: 'Enterprise',
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'TechStart Inc',
    domain: 'techstart.io',
    employees: 42,
    departments: 4,
    plan: 'Business',
    status: 'active',
    createdAt: '2024-03-20'
  },
];

const pendingInvites = [
  { id: '1', email: 'john.doe@example.com', role: 'Employee', sentAt: '2 days ago', status: 'pending' },
  { id: '2', email: 'jane.smith@example.com', role: 'Manager', sentAt: '5 days ago', status: 'pending' },
  { id: '3', email: 'mike.wilson@example.com', role: 'Admin', sentAt: '1 week ago', status: 'expired' },
];

const teamMembers = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah@acme.com', role: 'HR Admin', department: 'Human Resources', avatar: 'SJ', status: 'active' },
  { id: '2', name: 'Mike Chen', email: 'mike@acme.com', role: 'Manager', department: 'Engineering', avatar: 'MC', status: 'active' },
  { id: '3', name: 'Emma Davis', email: 'emma@acme.com', role: 'Employee', department: 'Marketing', avatar: 'ED', status: 'active' },
  { id: '4', name: 'Alex Wilson', email: 'alex@acme.com', role: 'Employee', department: 'Sales', avatar: 'AW', status: 'inactive' },
];

const SaasWorkspace: React.FC = () => {
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Workspace</h1>
          <p className="text-slate-500 mt-1">Manage your organizations and team members</p>
        </div>
        <Dialog open={showCreateOrg} onOpenChange={setShowCreateOrg}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg shadow-violet-200">
              <Plus className="w-4 h-4 mr-2" />
              Create Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Organization</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Organization Name</Label>
                <Input placeholder="Enter organization name" />
              </div>
              <div className="space-y-2">
                <Label>Domain</Label>
                <Input placeholder="company.com" />
              </div>
              <div className="space-y-2">
                <Label>Industry</Label>
                <Input placeholder="Technology, Healthcare, etc." />
              </div>
              <Button className="w-full bg-gradient-to-r from-violet-500 to-purple-600">
                Create Organization
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="organizations" className="space-y-6">
        <TabsList className="bg-white/80 border border-slate-200/60 p-1">
          <TabsTrigger value="organizations" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            Organizations
          </TabsTrigger>
          <TabsTrigger value="members" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            Team Members
          </TabsTrigger>
          <TabsTrigger value="invites" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            Pending Invites
          </TabsTrigger>
        </TabsList>

        {/* Organizations Tab */}
        <TabsContent value="organizations">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {organizations.map((org, index) => (
              <motion.div
                key={org.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-200">
                          <Building2 className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{org.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Globe className="w-3 h-3 text-slate-400" />
                            <span className="text-sm text-slate-500">{org.domain}</span>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-3 rounded-xl bg-slate-50">
                        <p className="text-2xl font-bold text-slate-900">{org.employees}</p>
                        <p className="text-xs text-slate-500">Employees</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-slate-50">
                        <p className="text-2xl font-bold text-slate-900">{org.departments}</p>
                        <p className="text-xs text-slate-500">Departments</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-slate-50">
                        <Badge className="bg-emerald-100 text-emerald-700 border-0">
                          {org.plan}
                        </Badge>
                        <p className="text-xs text-slate-500 mt-1">Plan</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-500">Created {org.createdAt}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-violet-600 hover:text-violet-700">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Open
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Add New Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card
                className="border-2 border-dashed border-slate-200 bg-transparent hover:border-violet-300 hover:bg-violet-50/30 transition-all cursor-pointer h-full min-h-[280px]"
                onClick={() => setShowCreateOrg(true)}
              >
                <CardContent className="flex flex-col items-center justify-center h-full p-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                    <Plus className="w-7 h-7 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-600">Create Organization</h3>
                  <p className="text-sm text-slate-400 text-center mt-2">
                    Set up a new company workspace
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* Team Members Tab */}
        <TabsContent value="members">
          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Team Members</CardTitle>
              <Dialog open={showInvite} onOpenChange={setShowInvite}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-violet-500 to-purple-600">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input placeholder="colleague@company.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input placeholder="Employee, Manager, Admin" />
                    </div>
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Input placeholder="Select department" />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-violet-500 to-purple-600">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Invitation
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between py-4"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="w-11 h-11">
                        <AvatarFallback className="bg-gradient-to-br from-violet-100 to-purple-100 text-violet-700">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-slate-900">{member.name}</h4>
                          {member.status === 'inactive' && (
                            <Badge variant="secondary" className="text-xs">Inactive</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-500">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-700">{member.role}</p>
                        <p className="text-xs text-slate-400">{member.department}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Role</DropdownMenuItem>
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Invites Tab */}
        <TabsContent value="invites">
          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100">
                {pendingInvites.map((invite, index) => (
                  <motion.div
                    key={invite.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between py-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{invite.email}</p>
                        <p className="text-sm text-slate-500">Sent {invite.sentAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        className={
                          invite.status === 'pending'
                            ? 'bg-amber-100 text-amber-700 border-0'
                            : 'bg-slate-100 text-slate-600 border-0'
                        }
                      >
                        {invite.status}
                      </Badge>
                      <Badge variant="outline">{invite.role}</Badge>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SaasWorkspace;
