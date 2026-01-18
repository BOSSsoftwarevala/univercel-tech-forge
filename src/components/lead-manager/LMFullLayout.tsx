import { useState } from 'react';
import { motion } from 'framer-motion';
import LMFullSidebar from './LMFullSidebar';
import LMOverview from './screens/LMOverview';
import LMSources from './screens/LMSources';
import LMCapture from './screens/LMCapture';
import LMQualification from './screens/LMQualification';
import LMPipeline from './screens/LMPipeline';
import LMActions from './screens/LMActions';
import LMAutomation from './screens/LMAutomation';
import LMTeam from './screens/LMTeam';
import LMAlerts from './screens/LMAlerts';
import LMReports from './screens/LMReports';
import LMIntegrations from './screens/LMIntegrations';
import LMSecurity from './screens/LMSecurity';
import LMSettings from './screens/LMSettings';

const LMFullLayout = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    // Overview section
    if (['dashboard', 'total_leads', 'active_leads', 'time_leads', 'conversion_rate'].includes(activeSection)) {
      return <LMOverview />;
    }
    
    // Sources section
    if (['website_leads', 'seo_leads', 'social_leads', 'ads_leads', 'marketplace_leads', 
         'referral_leads', 'manual_entry', 'api_leads', 'contact_forms', 'landing_pages',
         'chat_widget', 'exit_intent', 'organic_search', 'keyword_leads', 'location_seo',
         'facebook_leads', 'instagram_leads', 'linkedin_leads', 'twitter_leads',
         'google_ads', 'facebook_ads', 'instagram_ads', 'youtube_ads',
         'justdial', 'indiamart', 'tradeindia'].includes(activeSection)) {
      return <LMSources />;
    }
    
    // Capture & Routing section
    if (['auto_assignment', 'rule_distribution', 'geo_routing', 'product_routing', 
         'load_balancing', 'failover'].includes(activeSection)) {
      return <LMCapture />;
    }
    
    // Qualification section
    if (['lead_scoring', 'budget_detection', 'intent_detection', 'priority_flag', 
         'duplicate_detection'].includes(activeSection)) {
      return <LMQualification />;
    }
    
    // Pipeline section
    if (['stage_new', 'stage_contacted', 'stage_interested', 'stage_followup', 
         'stage_negotiation', 'stage_won', 'stage_lost'].includes(activeSection)) {
      return <LMPipeline />;
    }
    
    // Actions section
    if (['view_lead', 'edit_lead', 'assign_lead', 'reassign_lead', 'call_lead',
         'whatsapp_lead', 'email_lead', 'schedule_followup', 'convert_client', 
         'mark_lost'].includes(activeSection)) {
      return <LMActions />;
    }
    
    // Automation section
    if (['auto_followup', 'best_time', 'response_prediction', 'dropoff_alert', 
         'conversion_probability'].includes(activeSection)) {
      return <LMAutomation />;
    }
    
    // Team section
    if (['sales_team', 'availability', 'performance', 'lead_load', 
         'escalation_rules'].includes(activeSection)) {
      return <LMTeam />;
    }
    
    // Alerts section
    if (['new_lead_alert', 'idle_alert', 'sla_breach', 'duplicate_alert', 
         'high_value_alert'].includes(activeSection)) {
      return <LMAlerts />;
    }
    
    // Reports section
    if (['source_report', 'agent_performance', 'conversion_funnel', 'lost_analysis', 
         'export_reports'].includes(activeSection)) {
      return <LMReports />;
    }
    
    // Integrations section
    if (['crm_sync', 'whatsapp_api', 'email_api', 'call_api', 'form_api'].includes(activeSection)) {
      return <LMIntegrations />;
    }
    
    // Security section
    if (['access_control', 'masked_info', 'export_lock', 'audit_logs'].includes(activeSection)) {
      return <LMSecurity />;
    }
    
    // Settings section
    if (['status_rules', 'assignment_rules', 'notification_settings', 'working_hours', 
         'expiry_policy'].includes(activeSection)) {
      return <LMSettings />;
    }
    
    // Default
    return <LMOverview />;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LMFullSidebar 
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

export default LMFullLayout;
