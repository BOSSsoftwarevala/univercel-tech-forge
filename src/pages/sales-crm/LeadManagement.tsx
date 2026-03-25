import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  MessageCircle, 
  Globe, 
  MoreHorizontal,
  Mail,
  Calendar,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusPipeline = [
  { id: "new", label: "New", color: "bg-blue-500", count: 24 },
  { id: "contacted", label: "Contacted", color: "bg-yellow-500", count: 18 },
  { id: "qualified", label: "Qualified", color: "bg-purple-500", count: 12 },
  { id: "proposal", label: "Proposal", color: "bg-pink-500", count: 8 },
  { id: "negotiation", label: "Negotiation", color: "bg-orange-500", count: 5 },
];

const leads = [
  { 
    id: 1, 
    name: "Rahul Sharma", 
    email: "rahul@company.com", 
    phone: "+91 98765 43210",
    source: "Website", 
    status: "new", 
    value: "₹50,000",
    date: "Today, 10:30 AM"
  },
  { 
    id: 2, 
    name: "Priya Patel", 
    email: "priya@startup.io", 
    phone: "+91 87654 32109",
    source: "WhatsApp", 
    status: "contacted", 
    value: "₹1,20,000",
    date: "Today, 9:15 AM"
  },
  { 
    id: 3, 
    name: "Amit Kumar", 
    email: "amit@business.com", 
    phone: "+91 76543 21098",
    source: "Call", 
    status: "qualified", 
    value: "₹2,50,000",
    date: "Yesterday"
  },
  { 
    id: 4, 
    name: "Sneha Gupta", 
    email: "sneha@corp.in", 
    phone: "+91 65432 10987",
    source: "Website", 
    status: "proposal", 
    value: "₹75,000",
    date: "Yesterday"
  },
  { 
    id: 5, 
    name: "Vikram Singh", 
    email: "vikram@tech.com", 
    phone: "+91 54321 09876",
    source: "Call", 
    status: "new", 
    value: "₹3,00,000",
    date: "2 days ago"
  },
];

const getSourceIcon = (source: string) => {
  switch (source) {
    case "Call": return Phone;
    case "WhatsApp": return MessageCircle;
    case "Website": return Globe;
    default: return Globe;
  }
};

const LeadManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || lead.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Lead Management</h1>
          <p className="text-slate-500 mt-1">Manage and track all your leads</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-500 hover:bg-blue-600" size="lg">
              <Plus className="w-5 h-5" />
              Add New Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Full Name</Label>
                <Input placeholder="Enter lead name" className="mt-1" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="email@example.com" className="mt-1" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input placeholder="+91 " className="mt-1" />
              </div>
              <div>
                <Label>Source</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">Call</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Expected Value</Label>
                <Input placeholder="₹ 0" className="mt-1" />
              </div>
              <Button className="w-full bg-blue-500 hover:bg-blue-600" size="lg">
                Add Lead
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Status Pipeline */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {statusPipeline.map((status, index) => (
          <motion.div
            key={status.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedStatus === status.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedStatus(selectedStatus === status.id ? "all" : status.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${status.color}`} />
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{status.count}</p>
                    <p className="text-sm text-slate-500">{status.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search and Filter */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search leads by name or email..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statusPipeline.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-800">All Leads ({filteredLeads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLeads.map((lead, index) => {
              const SourceIcon = getSourceIcon(lead.source);
              const statusInfo = statusPipeline.find(s => s.id === lead.status);
              
              return (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                    {lead.name.charAt(0)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-800">{lead.name}</p>
                      <Badge className={`${statusInfo?.color} text-white`}>
                        {statusInfo?.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {lead.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {lead.phone}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200">
                    <SourceIcon className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-600">{lead.source}</span>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-slate-800">{lead.value}</p>
                    <p className="text-xs text-slate-500">{lead.date}</p>
                  </div>

                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadManagement;
