import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, Clock, User, Flame, Phone, Mail, 
  MoreHorizontal, ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Lead } from "@/pages/LeadManager";

interface LeadPipelineProps {
  onSelectLead: (lead: Lead) => void;
  selectedLead: Lead | null;
}

const LeadPipeline = ({ onSelectLead, selectedLead }: LeadPipelineProps) => {
  const columns = [
    { id: "new", label: "NEW", color: "from-blue-500 to-cyan-500", count: 24 },
    { id: "contacted", label: "CONTACTED", color: "from-indigo-500 to-purple-500", count: 18 },
    { id: "demo", label: "DEMO SHOWN", color: "from-purple-500 to-pink-500", count: 12 },
    { id: "negotiation", label: "NEGOTIATION", color: "from-orange-500 to-amber-500", count: 8 },
    { id: "won", label: "CLOSED WON", color: "from-green-500 to-emerald-500", count: 45 },
    { id: "lost", label: "CLOSED LOST", color: "from-red-500 to-rose-500", count: 15 },
  ];

  const [leads] = useState<Lead[]>([
    {
      id: "1",
      name: "Ahmed Hassan",
      maskedContact: "xxxxx89",
      email: "a****@gmail.com",
      software: "POS System",
      status: "new",
      source: "Website",
      region: "Nigeria",
      assignedTo: "vala(sales)4771",
      assignedRole: "Sales",
      lastAction: "Form submitted",
      lastActionTime: "14 sec ago",
      urgencyScore: 92,
      notes: ["Interested in multi-branch setup", "Budget: $2000-5000"],
      createdAt: "2024-01-15",
      qualityScore: 85,
    },
    {
      id: "2",
      name: "Priya Sharma",
      maskedContact: "xxxxx32",
      email: "p****@outlook.com",
      software: "School Management",
      status: "new",
      source: "Referral",
      region: "India",
      assignedTo: "vala(franchise)2891",
      assignedRole: "Franchise",
      lastAction: "Assigned",
      lastActionTime: "5 min ago",
      urgencyScore: 78,
      notes: ["Government school chain", "500+ students"],
      createdAt: "2024-01-15",
      qualityScore: 90,
    },
    {
      id: "3",
      name: "Mohammed Al-Rashid",
      maskedContact: "xxxxx56",
      email: "m****@company.ae",
      software: "Hospital ERP",
      status: "contacted",
      source: "LinkedIn",
      region: "UAE",
      assignedTo: "vala(sales)1234",
      assignedRole: "Sales",
      lastAction: "Email sent",
      lastActionTime: "1 hour ago",
      urgencyScore: 88,
      notes: ["Private hospital", "Looking for full integration"],
      createdAt: "2024-01-14",
      qualityScore: 92,
    },
    {
      id: "4",
      name: "Sarah Chen",
      maskedContact: "xxxxx78",
      email: "s****@retail.com",
      software: "Inventory System",
      status: "demo",
      source: "Google Ads",
      region: "Kenya",
      assignedTo: "vala(reseller)5678",
      assignedRole: "Reseller",
      lastAction: "Demo scheduled",
      lastActionTime: "2 hours ago",
      urgencyScore: 95,
      notes: ["Multi-location retail", "Urgent requirement"],
      createdAt: "2024-01-13",
      qualityScore: 88,
    },
    {
      id: "5",
      name: "James Okonkwo",
      maskedContact: "xxxxx45",
      email: "j****@business.ng",
      software: "Real Estate CRM",
      status: "negotiation",
      source: "Partner",
      region: "Nigeria",
      assignedTo: "vala(sales)4771",
      assignedRole: "Sales",
      lastAction: "Quote sent",
      lastActionTime: "Yesterday",
      urgencyScore: 82,
      notes: ["Property management company", "50+ agents"],
      createdAt: "2024-01-12",
      qualityScore: 78,
    },
    {
      id: "6",
      name: "Fatima Al-Said",
      maskedContact: "xxxxx23",
      email: "f****@edu.sa",
      software: "School Management",
      status: "won",
      source: "Website",
      region: "Saudi Arabia",
      assignedTo: "vala(franchise)2891",
      assignedRole: "Franchise",
      lastAction: "Contract signed",
      lastActionTime: "2 days ago",
      urgencyScore: 100,
      notes: ["Private school chain", "5 campuses"],
      createdAt: "2024-01-10",
      qualityScore: 95,
    },
  ]);

  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status);
  };

  const getUrgencyColor = (score: number) => {
    if (score >= 90) return "text-red-400";
    if (score >= 70) return "text-orange-400";
    return "text-yellow-400";
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Live Pipeline View</h2>
          <p className="text-slate-400">Drag and drop to update lead status</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-sm font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Lead
        </motion.button>
      </div>

      {/* Pipeline Columns */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column, colIndex) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: colIndex * 0.1 }}
            className="flex-shrink-0 w-72"
          >
            {/* Column Header */}
            <div className={`p-3 rounded-t-xl bg-gradient-to-r ${column.color} flex items-center justify-between`}>
              <span className="text-sm font-bold text-white">{column.label}</span>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium text-white">
                {column.count}
              </span>
            </div>

            {/* Column Body */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-b-xl border border-slate-700/50 border-t-0 p-3 min-h-[500px] space-y-3">
              {getLeadsByStatus(column.id).map((lead, index) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  onClick={() => onSelectLead(lead)}
                  className={`p-4 bg-slate-900/60 backdrop-blur-sm rounded-xl border cursor-pointer transition-all ${
                    selectedLead?.id === lead.id 
                      ? "border-indigo-500 shadow-lg shadow-indigo-500/20" 
                      : "border-slate-700/50 hover:border-indigo-500/50"
                  }`}
                >
                  {/* Lead Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-white">{lead.name}</h4>
                      <p className="text-xs text-slate-400">{lead.maskedContact}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame className={`w-4 h-4 ${getUrgencyColor(lead.urgencyScore)}`} />
                      <span className={`text-xs font-bold ${getUrgencyColor(lead.urgencyScore)}`}>
                        {lead.urgencyScore}
                      </span>
                    </div>
                  </div>

                  {/* Software Interest */}
                  <Badge className="mb-3 bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                    {lead.software}
                  </Badge>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <User className="w-3 h-3" />
                      <span>{lead.assignedTo}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{lead.lastAction} • {lead.lastActionTime}</span>
                    </div>
                  </div>

                  {/* Region & Source */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-300">
                        {lead.region}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-300">
                        {lead.source}
                      </span>
                    </div>
                    <button className="p-1 hover:bg-slate-700 rounded transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>

                  {/* New Lead Pulse */}
                  {lead.status === "new" && lead.lastActionTime.includes("sec") && (
                    <motion.div
                      className="mt-3 flex items-center gap-2 text-xs text-green-400"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      New Lead — {lead.lastActionTime}
                    </motion.div>
                  )}
                </motion.div>
              ))}

              {/* Add Card */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full p-4 border-2 border-dashed border-slate-700 rounded-xl text-slate-500 hover:text-indigo-400 hover:border-indigo-500/50 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Lead
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LeadPipeline;
