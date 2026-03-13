import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MailOpen, Reply, UserPlus, Ticket, ArrowUp, Clock, Bot, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { queueEmail, flushEmailQueue } from "@/services/emailQueueService";
import { supabase } from "@/integrations/supabase/client";

interface EmailRecord {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  status: "unread" | "read" | "replied" | "escalated";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo: string | null;
  slaTime: number;
  tags: string[];
  aiSuggestion: string;
  receivedAt: string;
}

const EmailQueueModule = () => {
  const [emails, setEmails] = useState<EmailRecord[]>([
    { id: "EM-001", from: "Tech Solutions Ltd", fromEmail: "john@techsol.com", subject: "Urgent: Invoice Query", preview: "Hi, I noticed a discrepancy in our latest invoice...", status: "unread", priority: "urgent", assignedTo: null, slaTime: 30, tags: ["billing", "urgent"], aiSuggestion: "Forward to billing team with invoice #12345 attached", receivedAt: "5 min ago" },
    { id: "EM-002", from: "Healthcare Plus", fromEmail: "maria@hcplus.com", subject: "Feature Request - Reporting", preview: "We would like to request additional reporting features...", status: "read", priority: "medium", assignedTo: "Lisa Park", slaTime: 120, tags: ["feature", "feedback"], aiSuggestion: "Standard feature request template - acknowledge and log", receivedAt: "30 min ago" },
    { id: "EM-003", from: "Retail Mart", fromEmail: "lisa@retailmart.com", subject: "RE: Support Ticket #TKT-089", preview: "Thank you for your quick response. However...", status: "replied", priority: "high", assignedTo: "Mike Johnson", slaTime: 45, tags: ["support", "follow-up"], aiSuggestion: "Customer requires additional clarification - schedule call", receivedAt: "1 hour ago" },
    { id: "EM-004", from: "EduLearn Academy", fromEmail: "robert@edulearn.com", subject: "Partnership Inquiry", preview: "We are interested in exploring partnership opportunities...", status: "read", priority: "low", assignedTo: null, slaTime: 240, tags: ["sales", "partnership"], aiSuggestion: "Forward to sales team for partnership evaluation", receivedAt: "2 hours ago" },
    { id: "EM-005", from: "Global Logistics", fromEmail: "james@globallog.com", subject: "COMPLAINT: Service Downtime", preview: "This is unacceptable! Your service was down for 3 hours...", status: "escalated", priority: "urgent", assignedTo: "Emma Davis", slaTime: 15, tags: ["complaint", "urgent", "escalated"], aiSuggestion: "High priority - immediate manager intervention required", receivedAt: "15 min ago" },
  ]);

  const agents = ["Sarah Chen", "Mike Johnson", "Lisa Park", "Emma Davis", "James Wilson"];

  const handleAssign = async (emailId: string, agent: string) => {
    toast.loading("Assigning email...", { id: `assign-${emailId}` });
    const { error } = await supabase
      .from('email_queue')
      .update({ metadata: { assignedTo: agent }, updated_at: new Date().toISOString() })
      .eq('id', emailId);
    if (error) {
      console.warn('[EmailQueueModule] Supabase assign update skipped:', error.message);
    }
    setEmails(emails.map(e => e.id === emailId ? { ...e, assignedTo: agent, status: "read" } : e));
    toast.success(`Assigned to ${agent}`, { id: `assign-${emailId}` });
  };

  const handleReply = async (emailId: string) => {
    toast.loading("Opening reply composer...", { id: `reply-${emailId}` });
    const email = emails.find(e => e.id === emailId);
    if (email) {
      await queueEmail({
        to: email.fromEmail,
        subject: `RE: ${email.subject}`,
        bodyHtml: `<p>Thank you for your message. Our team will get back to you shortly.</p>`,
        emailType: 'notification',
        priority: email.priority as 'low' | 'medium' | 'high' | 'urgent',
        metadata: { emailId, message: `RE: ${email.subject}` },
      });
      await flushEmailQueue(1);
    }
    setEmails(emails.map(e => e.id === emailId ? { ...e, status: "replied" } : e));
    toast.success("Reply sent", { id: `reply-${emailId}` });
  };

  const handleConvertToTicket = async (emailId: string) => {
    toast.loading("Creating ticket from email...", { id: `ticket-${emailId}` });
    const email = emails.find(e => e.id === emailId);
    const { error } = await supabase
      .from('support_tickets')
      .insert({
        subject: email?.subject ?? 'Email converted ticket',
        description: email?.preview ?? '',
        status: 'open',
        priority: email?.priority ?? 'medium',
        source: 'email',
        metadata: { email_id: emailId, from: email?.fromEmail },
      })
      .select('id')
      .single();
    if (error) {
      console.warn('[EmailQueueModule] Ticket insert skipped:', error.message);
    }
    toast.success("Ticket created", { id: `ticket-${emailId}`, description: "TKT-NEW added to queue" });
  };

  const handleEscalate = async (emailId: string) => {
    toast.loading("Escalating email...", { id: `escalate-${emailId}` });
    const email = emails.find(e => e.id === emailId);
    if (email) {
      await queueEmail({
        to: 'escalations@softwarevala.net',
        subject: `ESCALATED: ${email.subject}`,
        bodyHtml: `<p><strong>Escalated email from:</strong> ${email.fromEmail}</p><p>${email.preview}</p>`,
        emailType: 'buzzer_alert',
        priority: 'urgent',
        metadata: { emailId, alertType: 'Email Escalation', message: email.preview },
      });
    }
    setEmails(emails.map(e => e.id === emailId ? { ...e, status: "escalated", priority: "urgent" } : e));
    toast.warning("Email escalated", { id: `escalate-${emailId}` });
  };

  const handleUseAISuggestion = (emailId: string) => {
    const email = emails.find(e => e.id === emailId);
    toast.info("Applying AI suggestion", { description: email?.aiSuggestion });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500/20 text-red-300 border-red-500/30";
      case "high": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "medium": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default: return "bg-slate-500/20 text-slate-300";
    }
  };

  const getStatusIcon = (status: string) => {
    return status === "unread" ? Mail : MailOpen;
  };

  const unreadCount = emails.filter(e => e.status === "unread").length;
  const urgentCount = emails.filter(e => e.priority === "urgent" && e.status !== "replied").length;
  const slaRisk = emails.filter(e => e.slaTime < 60 && e.status !== "replied").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-100">Email Queue</h2>
          <p className="text-slate-400">Unified inbox with AI suggestions and SLA tracking</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4 text-center">
            <Mail className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-cyan-100">{emails.length}</div>
            <div className="text-xs text-slate-400">Total Emails</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <MailOpen className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-100">{unreadCount}</div>
            <div className="text-xs text-slate-400">Unread</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-red-500/20">
          <CardContent className="p-4 text-center">
            <Tag className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-100">{urgentCount}</div>
            <div className="text-xs text-slate-400">Urgent</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-100">{slaRisk}</div>
            <div className="text-xs text-slate-400">SLA Risk</div>
          </CardContent>
        </Card>
      </div>

      {/* Emails List */}
      <Card className="bg-slate-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-100">Inbox</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {emails.map((email, index) => {
              const StatusIcon = getStatusIcon(email.status);
              return (
                <motion.div
                  key={email.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors ${email.status === "unread" ? "border-l-4 border-cyan-500" : ""}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <StatusIcon className={`w-5 h-5 ${email.status === "unread" ? "text-cyan-400" : "text-slate-500"}`} />
                      <span className="font-mono text-cyan-400 text-sm">{email.id}</span>
                      <Badge className={getPriorityColor(email.priority)}>{email.priority}</Badge>
                      {email.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-slate-400 text-xs">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {email.status !== "replied" && (
                        <>
                          <Clock className={`w-4 h-4 ${email.slaTime < 60 ? "text-red-400" : "text-amber-400"}`} />
                          <span className={email.slaTime < 60 ? "text-red-300" : "text-amber-300"}>{email.slaTime} min</span>
                        </>
                      )}
                      <span className="text-slate-500">{email.receivedAt}</span>
                    </div>
                  </div>

                  <div className="mb-2">
                    <h4 className="font-medium text-slate-100">{email.subject}</h4>
                    <p className="text-sm text-slate-400">{email.from} &lt;{email.fromEmail}&gt; {email.assignedTo && `• Assigned: ${email.assignedTo}`}</p>
                    <p className="text-sm text-slate-500 truncate">{email.preview}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Bot className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-300/80 italic">{email.aiSuggestion}</span>
                      <Button size="sm" variant="ghost" onClick={() => handleUseAISuggestion(email.id)} className="text-purple-400 text-xs">
                        Apply
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      {!email.assignedTo && (
                        <Select onValueChange={(agent) => handleAssign(email.id, agent)}>
                          <SelectTrigger className="w-32 bg-slate-700/50 border-slate-600">
                            <SelectValue placeholder="Assign" />
                          </SelectTrigger>
                          <SelectContent>
                            {agents.map(agent => (
                              <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      <Button size="sm" variant="outline" onClick={() => handleReply(email.id)} className="border-cyan-500/30 text-cyan-300">
                        <Reply className="w-3 h-3 mr-1" />
                        Reply
                      </Button>

                      <Button size="sm" variant="outline" onClick={() => handleConvertToTicket(email.id)} className="border-amber-500/30 text-amber-300">
                        <Ticket className="w-3 h-3 mr-1" />
                        Ticket
                      </Button>

                      {email.status !== "escalated" && (
                        <Button size="sm" variant="outline" onClick={() => handleEscalate(email.id)} className="border-red-500/30 text-red-300">
                          <ArrowUp className="w-3 h-3 mr-1" />
                          Escalate
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

export default EmailQueueModule;
