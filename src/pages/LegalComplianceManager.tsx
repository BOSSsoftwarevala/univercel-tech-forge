import { useState } from "react";
import { motion } from "framer-motion";
import LegalSidebar from "@/components/legal/LegalSidebar";
import LegalTopBar from "@/components/legal/LegalTopBar";
import LegalDashboard from "@/components/legal/LegalDashboard";
import ContractTemplates from "@/components/legal/ContractTemplates";
import ClientContracts from "@/components/legal/ClientContracts";
import FranchiseAgreements from "@/components/legal/FranchiseAgreements";
import DeveloperNDA from "@/components/legal/DeveloperNDA";
import PolicyCenter from "@/components/legal/PolicyCenter";
import ComplianceRulebook from "@/components/legal/ComplianceRulebook";
import DisputeTracker from "@/components/legal/DisputeTracker";
import RiskAnalysis from "@/components/legal/RiskAnalysis";
import AuditLogs from "@/components/legal/AuditLogs";
import IPProtection from "@/components/legal/IPProtection";
import LicenseManager from "@/components/legal/LicenseManager";
import GlobalComplianceCenter from "@/components/legal/GlobalComplianceCenter";
import ContractAutomationStudio from "@/components/legal/ContractAutomationStudio";
import DataPrivacyControl from "@/components/legal/DataPrivacyControl";
import DisputeResolutionHub from "@/components/legal/DisputeResolutionHub";
import AuditInvestigationLab from "@/components/legal/AuditInvestigationLab";
import RegulatoryAPIHub from "@/components/legal/RegulatoryAPIHub";
import RiskHeatmapDashboard from "@/components/legal/RiskHeatmapDashboard";
import EvidenceVault from "@/components/legal/EvidenceVault";
import ComplianceAIAssistant from "@/components/legal/ComplianceAIAssistant";
import LegalQuickActions from "@/components/legal/LegalQuickActions";
import LegalNotifications from "@/components/legal/LegalNotifications";

const LegalComplianceManager = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <LegalDashboard />;
      case "global-compliance":
        return <GlobalComplianceCenter />;
      case "contract-automation":
        return <ContractAutomationStudio />;
      case "data-privacy":
        return <DataPrivacyControl />;
      case "dispute-hub":
        return <DisputeResolutionHub />;
      case "audit-lab":
        return <AuditInvestigationLab />;
      case "regulatory-api":
        return <RegulatoryAPIHub />;
      case "risk-heatmap":
        return <RiskHeatmapDashboard />;
      case "evidence-vault":
        return <EvidenceVault />;
      case "ai-assistant":
        return <ComplianceAIAssistant />;
      case "templates":
        return <ContractTemplates />;
      case "client-contracts":
        return <ClientContracts />;
      case "franchise-agreements":
        return <FranchiseAgreements />;
      case "developer-nda":
        return <DeveloperNDA />;
      case "policy-center":
        return <PolicyCenter />;
      case "compliance":
        return <ComplianceRulebook />;
      case "disputes":
        return <DisputeTracker />;
      case "risk-analysis":
        return <RiskAnalysis />;
      case "audit-logs":
        return <AuditLogs />;
      case "ip-protection":
        return <IPProtection />;
      case "license-manager":
        return <LicenseManager />;
      default:
        return <LegalDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 flex">
      <LegalSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="flex-1 flex flex-col">
        <LegalTopBar />
        
        <div className="flex-1 flex">
          <main className="flex-1 p-6 overflow-auto">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {renderContent()}
            </motion.div>
          </main>
          
          <LegalQuickActions />
        </div>
      </div>
      
      <LegalNotifications />
    </div>
  );
};

export default LegalComplianceManager;
