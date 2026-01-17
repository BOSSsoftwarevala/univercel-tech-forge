import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, PhoneIncoming, PhoneMissed, PhoneOff, UserPlus, Ticket, ArrowUp, CheckCircle, Clock, Mic } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CallRecord {
  id: string;
  type: "incoming" | "outgoing" | "missed";
  caller: string;
  phone: string;
  duration: string;
  status: "completed" | "missed" | "callback_pending" | "escalated";
  agent: string | null;
  aiSummary: string;
  timestamp: string;
  hasRecording: boolean;
}

const CallCenterModule = () => {
  const [calls, setCalls] = useState<CallRecord[]>([
    { id: "CALL-001", type: "incoming", caller: "Tech Solutions Ltd", phone: "+1 555-0101", duration: "12:34", status: "completed", agent: "Sarah Chen", aiSummary: "Customer inquired about invoice discrepancy. Resolved.", timestamp: "10 min ago", hasRecording: true },
    { id: "CALL-002", type: "missed", caller: "Healthcare Plus", phone: "+1 555-0102", duration: "-", status: "callback_pending", agent: null, aiSummary: "Missed call - requires callback", timestamp: "25 min ago", hasRecording: false },
    { id: "CALL-003", type: "incoming", caller: "Unknown", phone: "+1 555-0103", duration: "3:45", status: "escalated", agent: "Mike Johnson", aiSummary: "Angry customer regarding service downtime. Escalated to manager.", timestamp: "45 min ago", hasRecording: true },
    { id: "CALL-004", type: "outgoing", caller: "Retail Mart", phone: "+1 555-0104", duration: "8:21", status: "completed", agent: "Lisa Park", aiSummary: "Follow-up call for pending order. Customer confirmed shipment.", timestamp: "1 hour ago", hasRecording: true },
    { id: "CALL-005", type: "missed", caller: "EduLearn Academy", phone: "+1 555-0105", duration: "-", status: "missed", agent: null, aiSummary: "Missed call - no voicemail", timestamp: "2 hours ago", hasRecording: false },
  ]);

  const agents = ["Sarah Chen", "Mike Johnson", "Lisa Park", "Emma Davis", "James Wilson"];

  const handleAssignCallback = (callId: string, agent: string) => {
    toast.loading("Assigning callback...", { id: `callback-${callId}` });
    setTimeout(() => {
      setCalls(calls.map(c => c.id === callId ? { ...c, agent, status: "callback_pending" } : c));
      toast.success(`Callback assigned to ${agent}`, { id: `callback-${callId}` });
    }, 500);
  };

  const handleMarkResolved = (callId: string) => {
    toast.loading("Marking as resolved...", { id: `resolve-${callId}` });
    setTimeout(() => {
      setCalls(calls.map(c => c.id === callId ? { ...c, status: "completed" } : c));
      toast.success("Call marked as resolved", { id: `resolve-${callId}` });
    }, 500);
  };

  const handleEscalate = (callId: string) => {
    toast.loading("Escalating call...", { id: `escalate-${callId}` });
    setTimeout(() => {
      setCalls(calls.map(c => c.id === callId ? { ...c, status: "escalated" } : c));
      toast.warning("Call escalated to manager", { id: `escalate-${callId}` });
    }, 600);
  };

  const handleConvertToTicket = (callId: string) => {
    toast.loading("Creating ticket from call...", { id: `ticket-${callId}` });
    setTimeout(() => {
      toast.success("Ticket created from call", { id: `ticket-${callId}`, description: "TKT-NEW added to queue" });
    }, 700);
  };

  const handlePlayRecording = (callId: string) => {
    toast.info("Playing call recording...", { description: "Audio player opened" });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "incoming": return PhoneIncoming;
      case "outgoing": return Phone;
      case "missed": return PhoneMissed;
      default: return Phone;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-500/20 text-emerald-300";
      case "missed": return "bg-red-500/20 text-red-300";
      case "callback_pending": return "bg-amber-500/20 text-amber-300";
      case "escalated": return "bg-purple-500/20 text-purple-300";
      default: return "bg-slate-500/20 text-slate-300";
    }
  };

  const missedCalls = calls.filter(c => c.type === "missed").length;
  const pendingCallbacks = calls.filter(c => c.status === "callback_pending").length;
  const escalatedCalls = calls.filter(c => c.status === "escalated").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-100">Call Center</h2>
          <p className="text-slate-400">Call logs, recordings, and AI summaries</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4 text-center">
            <Phone className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-cyan-100">{calls.length}</div>
            <div className="text-xs text-slate-400">Total Calls Today</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-red-500/20">
          <CardContent className="p-4 text-center">
            <PhoneMissed className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-100">{missedCalls}</div>
            <div className="text-xs text-slate-400">Missed Calls</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-100">{pendingCallbacks}</div>
            <div className="text-xs text-slate-400">Pending Callbacks</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <ArrowUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-100">{escalatedCalls}</div>
            <div className="text-xs text-slate-400">Escalated</div>
          </CardContent>
        </Card>
      </div>

      {/* Calls List */}
      <Card className="bg-slate-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-100">Call Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {calls.map((call, index) => {
              const TypeIcon = getTypeIcon(call.type);
              return (
                <motion.div
                  key={call.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${call.type === "missed" ? "bg-red-500/20" : "bg-cyan-500/20"} flex items-center justify-center`}>
                        <TypeIcon className={`w-5 h-5 ${call.type === "missed" ? "text-red-400" : "text-cyan-400"}`} />
                      </div>
                      <div>
                        <span className="font-mono text-cyan-400 text-sm">{call.id}</span>
                        <Badge className={`ml-2 ${getStatusColor(call.status)}`}>{call.status.replace('_', ' ')}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      {call.duration !== "-" && <span className="font-mono">{call.duration}</span>}
                      <span>•</span>
                      <span>{call.timestamp}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-100">{call.caller}</h4>
                      <p className="text-sm text-slate-400">{call.phone} {call.agent && `• Agent: ${call.agent}`}</p>
                      <p className="text-sm text-cyan-400/80 mt-1 italic">AI: {call.aiSummary}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {call.hasRecording && (
                        <Button size="sm" variant="ghost" onClick={() => handlePlayRecording(call.id)} className="text-cyan-400">
                          <Mic className="w-4 h-4" />
                        </Button>
                      )}

                      {(call.status === "missed" || call.status === "callback_pending") && !call.agent && (
                        <Select onValueChange={(agent) => handleAssignCallback(call.id, agent)}>
                          <SelectTrigger className="w-36 bg-slate-700/50 border-slate-600">
                            <SelectValue placeholder="Assign callback" />
                          </SelectTrigger>
                          <SelectContent>
                            {agents.map(agent => (
                              <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {call.status !== "completed" && call.status !== "escalated" && (
                        <Button size="sm" variant="outline" onClick={() => handleEscalate(call.id)} className="border-purple-500/30 text-purple-300">
                          <ArrowUp className="w-3 h-3 mr-1" />
                          Escalate
                        </Button>
                      )}

                      <Button size="sm" variant="outline" onClick={() => handleConvertToTicket(call.id)} className="border-amber-500/30 text-amber-300">
                        <Ticket className="w-3 h-3 mr-1" />
                        To Ticket
                      </Button>

                      {call.status !== "completed" && (
                        <Button size="sm" onClick={() => handleMarkResolved(call.id)} className="bg-emerald-500 hover:bg-emerald-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Resolved
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CallCenterModule;
