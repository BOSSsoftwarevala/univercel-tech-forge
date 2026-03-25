import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'casual' | 'sick' | 'earned' | 'unpaid';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: string;
}

const leaveRequests: LeaveRequest[] = [
  { id: '1', employeeId: '1', employeeName: 'Rahul Kumar', leaveType: 'casual', startDate: '2025-01-05', endDate: '2025-01-07', days: 3, reason: 'Family function', status: 'pending', appliedOn: '2025-01-02' },
  { id: '2', employeeId: '2', employeeName: 'Priya Singh', leaveType: 'sick', startDate: '2025-01-03', endDate: '2025-01-03', days: 1, reason: 'Not feeling well', status: 'approved', appliedOn: '2025-01-03' },
  { id: '3', employeeId: '3', employeeName: 'Amit Sharma', leaveType: 'earned', startDate: '2025-01-10', endDate: '2025-01-12', days: 3, reason: 'Personal work', status: 'pending', appliedOn: '2025-01-01' },
  { id: '4', employeeId: '4', employeeName: 'Neha Gupta', leaveType: 'casual', startDate: '2024-12-25', endDate: '2024-12-26', days: 2, reason: 'Festival celebration', status: 'rejected', appliedOn: '2024-12-20' },
];

const leaveTypeConfig = {
  casual: { label: 'Casual Leave', color: 'bg-blue-500/10 text-blue-600' },
  sick: { label: 'Sick Leave', color: 'bg-red-500/10 text-red-600' },
  earned: { label: 'Earned Leave', color: 'bg-emerald-500/10 text-emerald-600' },
  unpaid: { label: 'Unpaid Leave', color: 'bg-gray-500/10 text-gray-600' },
};

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-500/10 text-amber-600', icon: Clock },
  approved: { label: 'Approved', color: 'bg-emerald-500/10 text-emerald-600', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-500/10 text-red-600', icon: XCircle },
};

export default function HRMLeave() {
  const [requests, setRequests] = useState<LeaveRequest[]>(leaveRequests);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    employee: '',
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedRequests = requests.filter(r => r.status === 'approved');
  const rejectedRequests = requests.filter(r => r.status === 'rejected');

  const handleApprove = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  };

  const handleReject = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
  };

  const handleApplyLeave = () => {
    if (newRequest.employee && newRequest.leaveType && newRequest.startDate && newRequest.endDate) {
      const startDate = new Date(newRequest.startDate);
      const endDate = new Date(newRequest.endDate);
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      const request: LeaveRequest = {
        id: Date.now().toString(),
        employeeId: newRequest.employee,
        employeeName: newRequest.employee,
        leaveType: newRequest.leaveType as 'casual' | 'sick' | 'earned' | 'unpaid',
        startDate: newRequest.startDate,
        endDate: newRequest.endDate,
        days,
        reason: newRequest.reason,
        status: 'pending',
        appliedOn: new Date().toISOString().split('T')[0],
      };

      setRequests([request, ...requests]);
      setNewRequest({ employee: '', leaveType: '', startDate: '', endDate: '', reason: '' });
      setIsApplyDialogOpen(false);
    }
  };

  const LeaveCard = ({ request, showActions = false }: { request: LeaveRequest; showActions?: boolean }) => {
    const StatusIcon = statusConfig[request.status].icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 bg-muted/50 rounded-lg"
      >
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <span className="text-primary font-medium">
                {request.employeeName.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{request.employeeName}</h3>
              <Badge className={leaveTypeConfig[request.leaveType].color}>
                {leaveTypeConfig[request.leaveType].label}
              </Badge>
              <p className="text-muted-foreground mt-2">{request.reason}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-center sm:text-right">
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium text-foreground">
                {request.startDate} to {request.endDate}
              </p>
              <p className="text-lg font-bold text-primary">{request.days} day{request.days > 1 ? 's' : ''}</p>
            </div>

            <div className="flex items-center gap-2">
              <Badge className={statusConfig[request.status].color}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusConfig[request.status].label}
              </Badge>

              {showActions && request.status === 'pending' && (
                <div className="flex gap-2 ml-2">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => handleApprove(request.id)}
                    className="gap-2 text-emerald-600 hover:text-emerald-600 hover:bg-emerald-500/10"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => handleReject(request.id)}
                    className="gap-2 text-red-600 hover:text-red-600 hover:bg-red-500/10"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Card className="border-border/50 px-4 py-2">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span className="text-lg font-semibold">{pendingRequests.length} Pending</span>
            </div>
          </Card>
          <Card className="border-border/50 px-4 py-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-lg font-semibold">{approvedRequests.length} Approved</span>
            </div>
          </Card>
        </div>

        <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Apply Leave
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Apply for Leave</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-base">Employee Name</Label>
                <Input
                  placeholder="Enter employee name"
                  value={newRequest.employee}
                  onChange={(e) => setNewRequest({ ...newRequest, employee: e.target.value })}
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-base">Leave Type</Label>
                <Select
                  value={newRequest.leaveType}
                  onValueChange={(value) => setNewRequest({ ...newRequest, leaveType: value })}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Casual Leave</SelectItem>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                    <SelectItem value="earned">Earned Leave</SelectItem>
                    <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-base">Start Date</Label>
                  <Input
                    type="date"
                    value={newRequest.startDate}
                    onChange={(e) => setNewRequest({ ...newRequest, startDate: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">End Date</Label>
                  <Input
                    type="date"
                    value={newRequest.endDate}
                    onChange={(e) => setNewRequest({ ...newRequest, endDate: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-base">Reason</Label>
                <Textarea
                  placeholder="Enter reason for leave"
                  value={newRequest.reason}
                  onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                  className="text-base min-h-[100px]"
                />
              </div>
              <Button onClick={handleApplyLeave} className="w-full h-12 text-base">
                Submit Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Leave Requests Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="pending" className="text-base">Pending ({pendingRequests.length})</TabsTrigger>
          <TabsTrigger value="approved" className="text-base">Approved ({approvedRequests.length})</TabsTrigger>
          <TabsTrigger value="rejected" className="text-base">Rejected ({rejectedRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-4">
          {pendingRequests.length > 0 ? (
            pendingRequests.map(request => (
              <LeaveCard key={request.id} request={request} showActions />
            ))
          ) : (
            <Card className="border-border/50 p-8 text-center">
              <p className="text-muted-foreground text-lg">No pending leave requests</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4 mt-4">
          {approvedRequests.length > 0 ? (
            approvedRequests.map(request => (
              <LeaveCard key={request.id} request={request} />
            ))
          ) : (
            <Card className="border-border/50 p-8 text-center">
              <p className="text-muted-foreground text-lg">No approved leave requests</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4 mt-4">
          {rejectedRequests.length > 0 ? (
            rejectedRequests.map(request => (
              <LeaveCard key={request.id} request={request} />
            ))
          ) : (
            <Card className="border-border/50 p-8 text-center">
              <p className="text-muted-foreground text-lg">No rejected leave requests</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
