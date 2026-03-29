import { useState } from "react";
import { motion } from "framer-motion";
import AAMSidebar from "./AAMSidebar";
import AAMDashboard from "./screens/AAMDashboard";
import AAMAIApiManagement from "./screens/AAMAIApiManagement";
import AAMExternalApiManagement from "./screens/AAMExternalApiManagement";
import AAMUsageMonitor from "./screens/AAMUsageMonitor";
import AAMProductApiControl from "./screens/AAMProductApiControl";
import AAMRoleApiControl from "./screens/AAMRoleApiControl";
import AAMWalletSystem from "./screens/AAMWalletSystem";
import AAMBillingEngine from "./screens/AAMBillingEngine";
import AAMAlertSafety from "./screens/AAMAlertSafety";
import AAMCostOptimizer from "./screens/AAMCostOptimizer";
import AAMSecurityAccess from "./screens/AAMSecurityAccess";
import AAMAuditLogs from "./screens/AAMAuditLogs";
import AAMEmergencyControls from "./screens/AAMEmergencyControls";
import AAMSettings from "./screens/AAMSettings";

interface AAMEnterpriseLayoutProps {
  onBack?: () => void;
}

const AAMEnterpriseLayout = ({ onBack }: AAMEnterpriseLayoutProps) => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    // Dashboard sections
    if (activeSection.startsWith("dashboard")) {
      return <AAMDashboard activeSubSection={activeSection} />;
    }
    
    // AI API Management
    if (activeSection === "ai-api" || activeSection.startsWith("ai-")) {
      return <AAMAIApiManagement activeSubSection={activeSection} />;
    }

    // External API Management
    if (activeSection === "external-api" || activeSection.startsWith("ext-")) {
      return <AAMExternalApiManagement activeSubSection={activeSection} />;
    }

    // Usage Monitor
    if (activeSection === "usage-monitor" || activeSection.startsWith("usage-")) {
      return <AAMUsageMonitor activeSubSection={activeSection} />;
    }

    // Product-wise API Control
    if (activeSection === "product-api" || activeSection.startsWith("product-")) {
      return <AAMProductApiControl activeSubSection={activeSection} />;
    }

    // Role-wise API Control
    if (activeSection === "role-api" || activeSection.startsWith("role-")) {
      return <AAMRoleApiControl activeSubSection={activeSection} />;
    }

    // Wallet System
    if (activeSection === "wallet" || activeSection.startsWith("wallet-")) {
      return <AAMWalletSystem activeSubSection={activeSection} />;
    }

    // Billing Engine
    if (activeSection === "billing" || activeSection.startsWith("billing-")) {
      return <AAMBillingEngine activeSubSection={activeSection} />;
    }

    // Alert & Safety System
    if (activeSection === "alerts" || activeSection.startsWith("alert-")) {
      return <AAMAlertSafety activeSubSection={activeSection} />;
    }

    // AI Cost Optimizer
    if (activeSection === "optimizer" || activeSection.startsWith("opt-")) {
      return <AAMCostOptimizer activeSubSection={activeSection} />;
    }

    // Security & Access
    if (activeSection === "security" || activeSection.startsWith("sec-")) {
      return <AAMSecurityAccess activeSubSection={activeSection} />;
    }

    // Audit & Logs
    if (activeSection === "audit" || activeSection.startsWith("audit-")) {
      return <AAMAuditLogs activeSubSection={activeSection} />;
    }

    // Emergency Controls
    if (activeSection === "emergency" || activeSection.startsWith("emg-")) {
      return <AAMEmergencyControls activeSubSection={activeSection} />;
    }

    // Settings
    if (activeSection === "settings" || activeSection.startsWith("settings-")) {
      return <AAMSettings activeSubSection={activeSection} />;
    }

    // Default
    return <AAMDashboard activeSubSection={activeSection} />;
  };

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AAMSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onBack={onBack}
      />
      
      <div className="flex-1 overflow-auto">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default AAMEnterpriseLayout;
