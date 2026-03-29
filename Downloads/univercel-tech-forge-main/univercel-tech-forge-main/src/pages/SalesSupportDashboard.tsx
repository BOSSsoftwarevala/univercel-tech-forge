import { useState } from "react";
import { motion } from "framer-motion";
import SalesSupportSidebar from "@/components/sales-support/SalesSupportSidebar";
import SalesSupportTopBar from "@/components/sales-support/SalesSupportTopBar";
import { Card, CardContent } from "@/components/ui/card";
import { Inbox, TrendingUp, DollarSign, Clock, AlertTriangle, Ticket, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

// Import all SSM modules
import {
  SupportTeamModule,
  SalesTeamModule,
  SupportTicketsModule,
  SalesLeadsModule,
  CRMCustomersModule,
  CallCenterModule,
  EmailQueueModule,
  LiveChatModule,
  EscalationsModule,
  SLAComplianceModule,
  AIInsightsModule,
  SSMSettingsModule,
} from "@/components/sales-support/modules";
import SalesPerformanceDashboard from "@/components/sales-support/SalesPerformanceDashboard";
import LeadInbox from "@/components/sales-support/LeadInbox";

const SalesSupportDashboard = () => {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [collapsed, setCollapsed] = useState(false);

  // Clickable KPI cards that navigate to filtered views
  const handleKPIClick = (section: string) => {
    setActiveSection(section);
    toast.info(`Navigating to ${section.replace('-', ' ')}`);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Clickable KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-slate-900/50 border-cyan-500/20 cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={() => handleKPIClick("support-tickets")}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                      <Ticket className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-cyan-100">12</div>
                      <div className="text-xs text-slate-400">Tickets Waiting</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 border-red-500/20 cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={() => handleKPIClick("escalations")}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-100">3</div>
                      <div className="text-xs text-slate-400">SLA Breach Risk</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 border-amber-500/20 cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={() => handleKPIClick("call-center")}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-amber-100">5</div>
                      <div className="text-xs text-slate-400">Missed Calls</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 border-purple-500/20 cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={() => handleKPIClick("sales-leads")}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-100">8</div>
                      <div className="text-xs text-slate-400">Hot Sales Leads</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LeadInbox />
            </div>
          </div>
        );
      case "support-team": return <SupportTeamModule />;
      case "sales-team": return <SalesTeamModule />;
      case "support-tickets": return <SupportTicketsModule />;
      case "sales-leads": return <SalesLeadsModule />;
      case "crm": return <CRMCustomersModule />;
      case "call-center": return <CallCenterModule />;
      case "email-queue": return <EmailQueueModule />;
      case "live-chat": return <LiveChatModule />;
      case "escalations": return <EscalationsModule />;
      case "sla-compliance": return <SLAComplianceModule />;
      case "performance": return <SalesPerformanceDashboard />;
      case "reports": return <SalesPerformanceDashboard />;
      case "support-activity": return <SupportTicketsModule />;
      case "sales-activity": return <SalesLeadsModule />;
      case "ai-insights": return <AIInsightsModule />;
      case "settings": return <SSMSettingsModule />;
      default: return <LeadInbox />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/20 flex"
    >
      <SalesSupportSidebar activeSection={activeSection as any} onSectionChange={(s) => setActiveSection(s)} collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
      <div className="flex-1 flex flex-col">
        <SalesSupportTopBar />
        <main className="flex-1 p-6 overflow-auto">
          <motion.div key={activeSection} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </motion.div>
  );
};

export default SalesSupportDashboard;
