import { useState } from 'react';
import { motion } from 'framer-motion';
import LMEnterpriseSidebar from './LMEnterpriseSidebar';
import LMDashboard from './LMDashboard';
import LMAllLeads from './LMAllLeads';
import LMSalesPipeline from './LMSalesPipeline';
import { LMSourceBreakdown } from './LMSourceBreakdown';
import { LMNewLeadsQueue } from './LMNewLeadsQueue';
import { LMSpamRejected } from './LMSpamRejected';
import { LMAIQualityAlerts } from './LMAIQualityAlerts';

const LMEnterpriseManager = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return <LMDashboard />;
      case 'all_leads': return <LMAllLeads />;
      case 'pipeline': return <LMSalesPipeline />;
      case 'sources': return <LMSourceBreakdown />;
      case 'fraud_filter': return <LMSpamRejected />;
      case 'ai_scoring': return <LMAIQualityAlerts />;
      case 'assignments': return <LMNewLeadsQueue />;
      default: return <LMDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LMEnterpriseSidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      <main className="ml-64 p-6">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </main>
    </div>
  );
};

export default LMEnterpriseManager;
