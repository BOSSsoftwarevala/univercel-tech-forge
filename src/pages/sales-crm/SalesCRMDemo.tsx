import { useState } from "react";
import SalesCRMLayout from "@/components/sales-crm/SalesCRMLayout";
import SalesCRMDashboard from "./SalesCRMDashboard";
import LeadManagement from "./LeadManagement";
import CustomerManagement from "./CustomerManagement";
import DealTracking from "./DealTracking";
import TasksFollowups from "./TasksFollowups";
import SalesCRMReports from "./SalesCRMReports";
import SalesCRMSettings from "./SalesCRMSettings";

const SalesCRMDemo = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <SalesCRMDashboard />;
      case "leads":
        return <LeadManagement />;
      case "customers":
        return <CustomerManagement />;
      case "deals":
        return <DealTracking />;
      case "tasks":
        return <TasksFollowups />;
      case "reports":
        return <SalesCRMReports />;
      case "settings":
        return <SalesCRMSettings />;
      default:
        return <SalesCRMDashboard />;
    }
  };

  return (
    <SalesCRMLayout 
      activeSection={activeSection} 
      onSectionChange={setActiveSection}
    >
      {renderContent()}
    </SalesCRMLayout>
  );
};

export default SalesCRMDemo;
