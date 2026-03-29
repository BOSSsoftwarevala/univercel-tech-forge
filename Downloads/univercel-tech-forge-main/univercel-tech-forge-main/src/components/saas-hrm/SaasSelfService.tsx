import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Calendar,
  FileText,
  Download,
  Upload,
  Edit,
  Clock,
  Check,
  X,
  Plus,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Building,
  GraduationCap,
  Award,
  Folder
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const leaveBalance = [
  { type: 'Annual Leave', total: 21, used: 8, pending: 2, color: 'violet' },
  { type: 'Sick Leave', total: 10, used: 3, pending: 0, color: 'blue' },
  { type: 'Personal Leave', total: 5, used: 2, pending: 1, color: 'amber' },
];

const leaveRequests = [
  { id: '1', type: 'Annual Leave', from: 'Jan 15, 2026', to: 'Jan 17, 2026', days: 3, status: 'approved', reason: 'Family vacation' },
  { id: '2', type: 'Sick Leave', from: 'Dec 20, 2025', to: 'Dec 20, 2025', days: 1, status: 'approved', reason: 'Medical appointment' },
  { id: '3', type: 'Personal Leave', from: 'Jan 25, 2026', to: 'Jan 25, 2026', days: 1, status: 'pending', reason: 'Personal matters' },
];

const documents = [
  { id: '1', name: 'Employment Contract', type: 'PDF', size: '245 KB', uploadedAt: 'Mar 15, 2024', category: 'contracts' },
  { id: '2', name: 'ID Proof', type: 'PDF', size: '1.2 MB', uploadedAt: 'Mar 15, 2024', category: 'identity' },
  { id: '3', name: 'Tax Form W-4', type: 'PDF', size: '180 KB', uploadedAt: 'Dec 1, 2025', category: 'tax' },
  { id: '4', name: 'Emergency Contact Form', type: 'PDF', size: '95 KB', uploadedAt: 'Mar 15, 2024', category: 'personal' },
];

const SaasSelfService: React.FC = () => {
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Self Service Portal</h1>
        <p className="text-slate-500 mt-1">Manage your profile, leaves, and documents</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-white/80 border border-slate-200/60 p-1">
          <TabsTrigger value="profile" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            My Profile
          </TabsTrigger>
          <TabsTrigger value="leave" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            Leave Management
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            Documents
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200" />
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-2xl">
                        JD
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold text-slate-900">John Doe</h3>
                    <p className="text-slate-500">Senior Software Engineer</p>
                    <Badge className="mt-2 bg-emerald-100 text-emerald-700 border-0">Active</Badge>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">john.doe@acme.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Building className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">Engineering</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">San Francisco, CA</span>
                    </div>
                  </div>

                  <Button className="w-full mt-6" variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Details Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Personal Information</CardTitle>
                    {isEditing && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button size="sm" className="bg-gradient-to-r from-violet-500 to-purple-600">
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input defaultValue="John" disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input defaultValue="Doe" disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input defaultValue="john.doe@acme.com" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input defaultValue="+1 (555) 123-4567" disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input defaultValue="1990-05-15" type="date" disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                      <Label>Join Date</Label>
                      <Input defaultValue="2022-03-15" type="date" disabled />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Address</Label>
                      <Textarea
                        defaultValue="123 Main Street, Apt 4B, San Francisco, CA 94102"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <h4 className="font-semibold text-slate-900 mb-4">Emergency Contact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input defaultValue="Jane Doe" disabled={!isEditing} />
                      </div>
                      <div className="space-y-2">
                        <Label>Relationship</Label>
                        <Input defaultValue="Spouse" disabled={!isEditing} />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input defaultValue="+1 (555) 987-6543" disabled={!isEditing} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* Leave Tab */}
        <TabsContent value="leave">
          <div className="space-y-6">
            {/* Leave Balance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {leaveBalance.map((leave, index) => (
                <motion.div
                  key={leave.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-slate-900">{leave.type}</h4>
                        <span className="text-2xl font-bold text-slate-900">
                          {leave.total - leave.used - leave.pending}
                        </span>
                      </div>
                      <Progress 
                        value={((leave.used + leave.pending) / leave.total) * 100} 
                        className="h-2"
                      />
                      <div className="flex justify-between mt-3 text-sm text-slate-500">
                        <span>Used: {leave.used}</span>
                        <span>Pending: {leave.pending}</span>
                        <span>Total: {leave.total}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Apply Leave Button */}
            <div className="flex justify-end">
              <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-violet-500 to-purple-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Apply for Leave
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Apply for Leave</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Leave Type</Label>
                      <Input placeholder="Select leave type" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>From Date</Label>
                        <Input type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label>To Date</Label>
                        <Input type="date" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Reason</Label>
                      <Textarea placeholder="Enter reason for leave" />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-violet-500 to-purple-600">
                      Submit Request
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Leave Requests */}
            <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Leave Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaveRequests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-violet-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">{request.type}</h4>
                          <p className="text-sm text-slate-500">
                            {request.from} - {request.to} ({request.days} day{request.days > 1 ? 's' : ''})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-sm text-slate-500 max-w-xs truncate">{request.reason}</p>
                        <Badge className={
                          request.status === 'approved' 
                            ? 'bg-emerald-100 text-emerald-700 border-0' 
                            : request.status === 'pending'
                            ? 'bg-amber-100 text-amber-700 border-0'
                            : 'bg-red-100 text-red-700 border-0'
                        }>
                          {request.status}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Documents</CardTitle>
                <Button className="bg-gradient-to-r from-violet-500 to-purple-600">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{doc.name}</h4>
                        <p className="text-sm text-slate-500">{doc.size} • {doc.uploadedAt}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
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

export default SaasSelfService;
