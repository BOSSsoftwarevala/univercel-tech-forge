import { useState } from "react";
import { motion } from "framer-motion";
import { 
  X, Phone, Mail, Video, Calendar, Send, 
  AlertTriangle, MessageSquare, User, Clock,
  Globe, Target, FileText, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { Lead } from "@/pages/LeadManager";

interface LeadDetailsProps {
  lead: Lead;
  onClose: () => void;
}

const LeadDetails = ({ lead, onClose }: LeadDetailsProps) => {
  const [newNote, setNewNote] = useState("");
  const [chatMessages] = useState([
    { sender: "vala(sales)4771", message: "Initial contact made via email", time: "2 hours ago", role: "Sales" },
    { sender: "vala(support)2341", message: "Customer has technical questions about integration", time: "1 hour ago", role: "Support" },
    { sender: "AI Auto-Translation", message: "Language detected: Arabic → English translation applied", time: "45 min ago", role: "System" },
  ]);

  const quickActions = [
    { icon: Video, label: "Send Demo Link", color: "from-blue-500 to-cyan-500" },
    { icon: FileText, label: "Send Quote", color: "from-purple-500 to-pink-500" },
    { icon: Calendar, label: "Schedule Call", color: "from-green-500 to-emerald-500" },
    { icon: AlertTriangle, label: "Escalate", color: "from-orange-500 to-amber-500" },
    { icon: Clock, label: "Mark Follow-up", color: "from-indigo-500 to-purple-500" },
  ];

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-[480px] bg-slate-900/95 backdrop-blur-xl border-l border-indigo-500/20 z-50 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold">
            {lead.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-white">{lead.name}</h3>
            <p className="text-sm text-slate-400">{lead.maskedContact}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-5 h-5 text-slate-400" />
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Status & Score */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-800/50 rounded-xl">
            <p className="text-xs text-slate-400 mb-1">Status</p>
            <Badge className="bg-indigo-500/20 text-indigo-300 capitalize">
              {lead.status}
            </Badge>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-xl">
            <p className="text-xs text-slate-400 mb-1">Urgency Score</p>
            <div className="flex items-center gap-2">
              <div className={`text-xl font-bold ${
                lead.urgencyScore >= 90 ? "text-red-400" :
                lead.urgencyScore >= 70 ? "text-orange-400" : "text-yellow-400"
              }`}>
                {lead.urgencyScore}
              </div>
              <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${lead.urgencyScore}%` }}
                  className={`h-full rounded-full ${
                    lead.urgencyScore >= 90 ? "bg-red-500" :
                    lead.urgencyScore >= 70 ? "bg-orange-500" : "bg-yellow-500"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lead Info */}
        <div className="bg-slate-800/50 rounded-xl p-4 space-y-3">
          <h4 className="text-sm font-semibold text-white mb-3">Lead Information</h4>
          
          <div className="flex items-center gap-3">
            <Target className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-slate-400">Software Interest:</span>
            <span className="text-sm text-white">{lead.software}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-slate-400">Region:</span>
            <span className="text-sm text-white">{lead.region}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-slate-400">Assigned:</span>
            <span className="text-sm text-white">{lead.assignedTo}</span>
            <Badge variant="outline" className="text-xs">{lead.assignedRole}</Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-slate-400">Last Action:</span>
            <span className="text-sm text-white">{lead.lastAction}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-3 bg-gradient-to-r ${action.color} bg-opacity-10 rounded-xl border border-white/10 flex items-center gap-2 text-white text-sm font-medium hover:border-white/20 transition-all`}
              >
                <action.icon className="w-4 h-4" />
                {action.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-slate-800/50 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-white mb-3">Notes</h4>
          <div className="space-y-2 mb-3">
            {lead.notes.map((note, index) => (
              <div key={index} className="p-2 bg-slate-900/50 rounded-lg text-sm text-slate-300">
                • {note}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Textarea 
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note..."
              className="bg-slate-900/50 border-slate-600 resize-none text-sm"
              rows={2}
            />
            <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600 px-3">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Internal Chat Thread */}
        <div className="bg-slate-800/50 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            Internal Chat Thread
          </h4>
          <div className="space-y-3">
            {chatMessages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg ${
                  msg.role === "System" 
                    ? "bg-indigo-500/10 border border-indigo-500/20" 
                    : "bg-slate-900/50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-indigo-400">{msg.sender}</span>
                  <span className="text-xs text-slate-500">{msg.time}</span>
                </div>
                <p className="text-sm text-slate-300">{msg.message}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-700/50 flex gap-2">
        <Button className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500">
          <Phone className="w-4 h-4 mr-2" />
          Call Now
        </Button>
        <Button variant="outline" className="flex-1 border-slate-600">
          <Mail className="w-4 h-4 mr-2" />
          Send Email
        </Button>
      </div>
    </motion.div>
  );
};

export default LeadDetails;
