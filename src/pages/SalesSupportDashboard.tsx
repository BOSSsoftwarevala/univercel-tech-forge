import { useState } from "react";
import { motion } from "framer-motion";
import SalesSupportSidebar from "@/components/sales-support/SalesSupportSidebar";
import SalesSupportTopBar from "@/components/sales-support/SalesSupportTopBar";
import LeadInbox from "@/components/sales-support/LeadInbox";
import SalesScriptConsole from "@/components/sales-support/SalesScriptConsole";
import DemoDispatchCenter from "@/components/sales-support/DemoDispatchCenter";
import CommunicationHub from "@/components/sales-support/CommunicationHub";
import AISalesCopilot from "@/components/sales-support/AISalesCopilot";
import ConversionPipeline from "@/components/sales-support/ConversionPipeline";
import CommissionBoard from "@/components/sales-support/CommissionBoard";
import EscalationTree from "@/components/sales-support/EscalationTree";
import SalesPerformanceDashboard from "@/components/sales-support/SalesPerformanceDashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Inbox, TrendingUp, DollarSign, Clock, Target, Users } from "lucide-react";

const SalesSupportDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-slate-900/50 border-cyan-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                      <Inbox className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-cyan-100">25</div>
                      <div className="text-xs text-slate-400">New Leads</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 border-emerald-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-emerald-100">68%</div>
                      <div className="text-xs text-slate-400">Conversion Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 border-amber-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-amber-100">$4,890</div>
                      <div className="text-xs text-slate-400">Commission</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 border-purple-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-100">3 min</div>
                      <div className="text-xs text-slate-400">Avg Response</div>
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
      case "lead-inbox": return <LeadInbox />;
      case "scripts": return <SalesScriptConsole />;
      case "demo-dispatch": return <DemoDispatchCenter />;
      case "communication": return <CommunicationHub />;
      case "ai-copilot": return <AISalesCopilot />;
      case "tickets": return <LeadInbox />;
      case "pipeline": return <ConversionPipeline />;
      case "commission": return <CommissionBoard />;
      case "masking": return <CommunicationHub />;
      case "followup": return <DemoDispatchCenter />;
      case "knowledge": return <SalesScriptConsole />;
      case "qualification": return <AISalesCopilot />;
      case "feedback": return <SalesPerformanceDashboard />;
      case "escalation": return <EscalationTree />;
      case "announcements": return <LeadInbox />;
      case "performance": return <SalesPerformanceDashboard />;
      case "call-scripts": return <SalesScriptConsole />;
      case "complaints": return <EscalationTree />;
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
      <SalesSupportSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
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
