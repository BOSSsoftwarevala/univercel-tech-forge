/**
 * PD LEAD MANAGEMENT
 * Manage leads and demo attendees
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Download, 
  Mail, 
  Phone, 
  Globe2, 
  Calendar,
  ThermometerSun,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Users,
  TrendingUp
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  demoAttended: boolean;
  interestLevel: 'hot' | 'warm' | 'cold';
  followUpStatus: 'pending' | 'completed' | 'scheduled';
  scheduledDate: string;
}

const leads: Lead[] = [
  { id: '1', name: 'John Smith', email: 'john@acme.com', phone: '+1 555-0123', country: 'USA', demoAttended: true, interestLevel: 'hot', followUpStatus: 'scheduled', scheduledDate: '2025-01-15' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@techstart.io', phone: '+1 555-0456', country: 'USA', demoAttended: true, interestLevel: 'warm', followUpStatus: 'pending', scheduledDate: '2025-01-14' },
  { id: '3', name: 'Raj Patel', email: 'raj@globaltech.in', phone: '+91 98765-43210', country: 'India', demoAttended: false, interestLevel: 'cold', followUpStatus: 'pending', scheduledDate: '2025-01-16' },
  { id: '4', name: 'Emma Wilson', email: 'emma@innovate.uk', phone: '+44 20 7946 0958', country: 'UK', demoAttended: true, interestLevel: 'hot', followUpStatus: 'completed', scheduledDate: '2025-01-12' },
  { id: '5', name: 'Ahmed Hassan', email: 'ahmed@dubai-corp.ae', phone: '+971 50 123 4567', country: 'UAE', demoAttended: true, interestLevel: 'warm', followUpStatus: 'scheduled', scheduledDate: '2025-01-17' },
  { id: '6', name: 'Lisa Chen', email: 'lisa@sgtech.sg', phone: '+65 9123 4567', country: 'Singapore', demoAttended: false, interestLevel: 'warm', followUpStatus: 'pending', scheduledDate: '2025-01-18' },
];

const getInterestBadge = (level: Lead['interestLevel']) => {
  switch (level) {
    case 'hot':
      return <Badge className="bg-red-100 text-red-700 border-0">🔥 Hot</Badge>;
    case 'warm':
      return <Badge className="bg-amber-100 text-amber-700 border-0">☀️ Warm</Badge>;
    case 'cold':
      return <Badge className="bg-blue-100 text-blue-700 border-0">❄️ Cold</Badge>;
  }
};

const getStatusBadge = (status: Lead['followUpStatus']) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-100 text-green-700 border-0">Completed</Badge>;
    case 'scheduled':
      return <Badge className="bg-blue-100 text-blue-700 border-0">Scheduled</Badge>;
    case 'pending':
      return <Badge className="bg-slate-100 text-slate-600 border-0">Pending</Badge>;
  }
};

export const PDLeadManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterInterest, setFilterInterest] = useState('all');
  const [filterAttendance, setFilterAttendance] = useState('all');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesInterest = filterInterest === 'all' || lead.interestLevel === filterInterest;
    const matchesAttendance = filterAttendance === 'all' || 
                              (filterAttendance === 'attended' && lead.demoAttended) ||
                              (filterAttendance === 'missed' && !lead.demoAttended);
    return matchesSearch && matchesInterest && matchesAttendance;
  });

  const handleExport = () => {
    toast({
      title: "Export Leads",
      description: "Preparing CSV download...",
    });
  };

  const handleFollowUp = (lead: Lead) => {
    toast({
      title: "Schedule Follow-up",
      description: `Opening follow-up dialog for ${lead.name}...`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Lead Management</h1>
          <p className="text-slate-500 mt-1">Track and manage demo attendees</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{leads.length}</p>
              <p className="text-xs text-slate-500">Total Leads</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{leads.filter(l => l.demoAttended).length}</p>
              <p className="text-xs text-slate-500">Attended</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <ThermometerSun className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{leads.filter(l => l.interestLevel === 'hot').length}</p>
              <p className="text-xs text-slate-500">Hot Leads</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">34%</p>
              <p className="text-xs text-slate-500">Conversion</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by name, email, country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterInterest} onValueChange={setFilterInterest}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Interest Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="hot">🔥 Hot</SelectItem>
            <SelectItem value="warm">☀️ Warm</SelectItem>
            <SelectItem value="cold">❄️ Cold</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterAttendance} onValueChange={setFilterAttendance}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Attendance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="attended">Attended</SelectItem>
            <SelectItem value="missed">Missed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leads Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold">Lead</TableHead>
                <TableHead className="font-semibold">Contact</TableHead>
                <TableHead className="font-semibold">Country</TableHead>
                <TableHead className="font-semibold text-center">Attended</TableHead>
                <TableHead className="font-semibold">Interest</TableHead>
                <TableHead className="font-semibold">Follow-up</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                        <span className="text-sm text-white font-medium">{lead.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-slate-800">{lead.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Mail className="w-3 h-3" />
                        <span className="truncate max-w-[150px]">{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Phone className="w-3 h-3" />
                        <span>{lead.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm text-slate-600">{lead.country}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {lead.demoAttended ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="w-5 h-5 text-slate-300 mx-auto" />
                    )}
                  </TableCell>
                  <TableCell>{getInterestBadge(lead.interestLevel)}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getStatusBadge(lead.followUpStatus)}
                      {lead.followUpStatus === 'scheduled' && (
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Calendar className="w-3 h-3" />
                          <span>{lead.scheduledDate}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleFollowUp(lead)}
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      Follow-up
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
