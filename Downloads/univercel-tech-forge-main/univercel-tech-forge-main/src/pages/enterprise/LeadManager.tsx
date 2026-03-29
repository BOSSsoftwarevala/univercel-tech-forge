import { useState } from "react";
import { 
  Users, Filter, Download, Plus, Search, Phone, Mail, MapPin, 
  Star, ArrowRight, MoreHorizontal, Zap, Brain, Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const pipelineStages = [
  { id: "new", label: "New", count: 145, color: "bg-[hsl(var(--sv-blue))]" },
  { id: "qualified", label: "Qualified", count: 89, color: "bg-[hsl(var(--sv-info))]" },
  { id: "in_progress", label: "In Progress", count: 67, color: "bg-[hsl(var(--sv-warning))]" },
  { id: "closed", label: "Closed", count: 234, color: "bg-[hsl(var(--sv-success))]" },
];

const leads = [
  { id: 1, name: "Rajesh K***", phone: "+91 98***456", email: "ra***@gmail.com", location: "Mumbai", product: "CRM Pro", score: 92, status: "new", source: "Website" },
  { id: 2, name: "Priya S***", phone: "+91 87***123", email: "pr***@yahoo.com", location: "Delhi", product: "ERP Suite", score: 85, status: "qualified", source: "Referral" },
  { id: 3, name: "Amit P***", phone: "+91 76***789", email: "am***@outlook.com", location: "Bangalore", product: "HRMS", score: 78, status: "in_progress", source: "LinkedIn" },
  { id: 4, name: "Sneha M***", phone: "+91 65***012", email: "sn***@gmail.com", location: "Chennai", product: "Inventory", score: 95, status: "new", source: "Facebook" },
  { id: 5, name: "Vikram R***", phone: "+91 54***345", email: "vi***@company.com", location: "Hyderabad", product: "Billing", score: 67, status: "qualified", source: "Cold Call" },
];

export default function LeadManager() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-[hsl(var(--sv-blue-bright))]" />
            Lead Manager
          </h1>
          <p className="text-[hsl(var(--sv-gray))]">Manage and track all leads in the pipeline</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-[hsl(var(--sv-navy))] border-[hsl(var(--sv-navy-light))] text-[hsl(var(--sv-white-soft))]">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button className="bg-[hsl(var(--sv-blue))] hover:bg-[hsl(var(--sv-blue-bright))]">
            <Plus className="w-4 h-4 mr-2" /> Add Lead
          </Button>
        </div>
      </div>

      {/* Pipeline */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {pipelineStages.map((stage) => (
          <Card key={stage.id} className="bg-[hsl(var(--sv-navy))] border-[hsl(var(--sv-navy-light))] cursor-pointer hover:border-[hsl(var(--sv-blue))]/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                <ArrowRight className="w-4 h-4 text-[hsl(var(--sv-gray))]" />
              </div>
              <p className="text-3xl font-bold text-white">{stage.count}</p>
              <p className="text-sm text-[hsl(var(--sv-gray))]">{stage.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Buzzer Alert */}
      <Card className="bg-[hsl(var(--sv-danger))]/10 border-[hsl(var(--sv-danger))]/30">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[hsl(var(--sv-danger))] flex items-center justify-center animate-pulse">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium">12 unassigned leads requiring immediate attention</p>
            <p className="text-sm text-[hsl(var(--sv-gray))]">Auto-escalation in 15 minutes</p>
          </div>
          <Button className="bg-[hsl(var(--sv-danger))] hover:bg-red-600">
            Assign Now
          </Button>
        </CardContent>
      </Card>

      {/* Filters & Search */}
      <Card className="bg-[hsl(var(--sv-navy))] border-[hsl(var(--sv-navy-light))]">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--sv-gray))]" />
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[hsl(var(--sv-navy-deep))] border-[hsl(var(--sv-navy-light))] text-white"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[180px] bg-[hsl(var(--sv-navy-deep))] border-[hsl(var(--sv-navy-light))] text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px] bg-[hsl(var(--sv-navy-deep))] border-[hsl(var(--sv-navy-light))] text-white">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="bg-[hsl(var(--sv-navy-deep))] border-[hsl(var(--sv-navy-light))] text-[hsl(var(--sv-white-soft))]">
              <Filter className="w-4 h-4 mr-2" /> More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lead Table */}
      <Card className="bg-[hsl(var(--sv-navy))] border-[hsl(var(--sv-navy-light))]">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-[hsl(var(--sv-navy-light))]">
                <TableHead className="text-[hsl(var(--sv-gray))]">Lead</TableHead>
                <TableHead className="text-[hsl(var(--sv-gray))]">Contact (Masked)</TableHead>
                <TableHead className="text-[hsl(var(--sv-gray))]">Location</TableHead>
                <TableHead className="text-[hsl(var(--sv-gray))]">Product Interest</TableHead>
                <TableHead className="text-[hsl(var(--sv-gray))]">AI Score</TableHead>
                <TableHead className="text-[hsl(var(--sv-gray))]">Status</TableHead>
                <TableHead className="text-[hsl(var(--sv-gray))]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id} className="border-[hsl(var(--sv-navy-light))] hover:bg-[hsl(var(--sv-navy-deep))]">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[hsl(var(--sv-blue))]/20 flex items-center justify-center">
                        <span className="text-[hsl(var(--sv-blue-bright))] font-medium">{lead.name[0]}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{lead.name}</p>
                        <p className="text-xs text-[hsl(var(--sv-gray))]">{lead.source}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-[hsl(var(--sv-white-soft))]">
                        <Phone className="w-3 h-3" /> {lead.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[hsl(var(--sv-white-soft))]">
                        <Mail className="w-3 h-3" /> {lead.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-[hsl(var(--sv-white-soft))]">
                      <MapPin className="w-4 h-4" /> {lead.location}
                    </div>
                  </TableCell>
                  <TableCell className="text-[hsl(var(--sv-white-soft))]">{lead.product}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-[hsl(var(--sv-blue-bright))]" />
                      <span className={`font-medium ${
                        lead.score >= 90 ? "text-[hsl(var(--sv-success))]" :
                        lead.score >= 70 ? "text-[hsl(var(--sv-warning))]" :
                        "text-[hsl(var(--sv-danger))]"
                      }`}>{lead.score}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${
                      lead.status === "new" ? "bg-[hsl(var(--sv-blue))]" :
                      lead.status === "qualified" ? "bg-[hsl(var(--sv-info))]" :
                      lead.status === "in_progress" ? "bg-[hsl(var(--sv-warning))]" :
                      "bg-[hsl(var(--sv-success))]"
                    }`}>
                      {lead.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="text-[hsl(var(--sv-white-soft))] hover:text-white">
                        <Calendar className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-[hsl(var(--sv-white-soft))] hover:text-white">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
