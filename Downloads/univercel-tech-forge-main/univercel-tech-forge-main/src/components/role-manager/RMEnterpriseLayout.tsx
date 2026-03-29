/**
 * ROLE MANAGER ENTERPRISE LAYOUT
 * Full dashboard with sidebar + 10 screen sections
 */

import { useState, useCallback } from "react";
import { RMSidebar } from "./RMSidebar";
import { RMOverview } from "./screens/RMOverview";
import { RMCreation } from "./screens/RMCreation";
import { RMPermissions } from "./screens/RMPermissions";
import { RMAssignment } from "./screens/RMAssignment";
import { RMApprovals } from "./screens/RMApprovals";
import { RMHierarchy } from "./screens/RMHierarchy";
import { RMAIControl } from "./screens/RMAIControl";
import { RMAudit } from "./screens/RMAudit";
import { RMSecurity } from "./screens/RMSecurity";
import { RMSettings } from "./screens/RMSettings";

const RMEnterpriseLayout = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [activeItem, setActiveItem] = useState("dashboard");

  const handleNavigate = useCallback((sectionId: string, itemId: string) => {
    setActiveSection(sectionId);
    setActiveItem(itemId);
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <RMOverview activeItem={activeItem} />;
      case 'creation':
        return <RMCreation activeItem={activeItem} />;
      case 'permissions':
        return <RMPermissions activeItem={activeItem} />;
      case 'assignment':
        return <RMAssignment activeItem={activeItem} />;
      case 'approvals':
        return <RMApprovals activeItem={activeItem} />;
      case 'hierarchy':
        return <RMHierarchy activeItem={activeItem} />;
      case 'ai-control':
        return <RMAIControl activeItem={activeItem} />;
      case 'audit':
        return <RMAudit activeItem={activeItem} />;
      case 'security':
        return <RMSecurity activeItem={activeItem} />;
      case 'settings':
        return <RMSettings activeItem={activeItem} />;
      default:
        return <RMOverview activeItem={activeItem} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <RMSidebar
        activeSection={activeSection}
        activeItem={activeItem}
        onNavigate={handleNavigate}
      />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default RMEnterpriseLayout;
