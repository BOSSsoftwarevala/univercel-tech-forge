import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Target, TrendingUp, Globe, FileText, MessageSquare,
  Search, Share2, Megaphone, Store, Users, Zap, GitBranch, Filter,
  Brain, AlertTriangle, Copy, Layers, Eye, Edit, Phone, Mail,
  MessageCircle, Calendar, UserCheck, XCircle, Bot, Clock, Lightbulb,
  UserCog, Activity, Bell, AlertCircle, FileBarChart, BarChart3,
  Plug, Link, Shield, Lock, FileSearch, Settings, ChevronDown, ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LMFullSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sidebarSections = [
  {
    id: 'overview',
    label: '1. Lead Overview',
    items: [
      { id: 'dashboard', label: 'Lead Dashboard', icon: LayoutDashboard },
      { id: 'total_leads', label: 'Total Leads', icon: Target, badge: 3717 },
      { id: 'active_leads', label: 'Active / Cold / Hot Leads', icon: TrendingUp },
      { id: 'time_leads', label: 'Today / Weekly / Monthly', icon: Calendar },
      { id: 'conversion_rate', label: 'Conversion Rate', icon: BarChart3 },
    ]
  },
  {
    id: 'sources',
    label: '2. Lead Sources',
    items: [
      { 
        id: 'website_leads', 
        label: 'Website Leads', 
        icon: Globe,
        children: [
          { id: 'contact_forms', label: 'Contact Forms' },
          { id: 'landing_pages', label: 'Landing Pages' },
          { id: 'chat_widget', label: 'Chat Widget' },
          { id: 'exit_intent', label: 'Exit Intent Forms' },
        ]
      },
      { 
        id: 'seo_leads', 
        label: 'SEO Leads', 
        icon: Search,
        children: [
          { id: 'organic_search', label: 'Organic Search' },
          { id: 'keyword_leads', label: 'Keyword-Based Leads' },
          { id: 'location_seo', label: 'Location-Based SEO' },
        ]
      },
      { 
        id: 'social_leads', 
        label: 'Social Media Leads', 
        icon: Share2,
        children: [
          { id: 'facebook_leads', label: 'Facebook Leads' },
          { id: 'instagram_leads', label: 'Instagram Leads' },
          { id: 'linkedin_leads', label: 'LinkedIn Leads' },
          { id: 'twitter_leads', label: 'Twitter / X Leads' },
        ]
      },
      { 
        id: 'ads_leads', 
        label: 'Ads Leads', 
        icon: Megaphone,
        children: [
          { id: 'google_ads', label: 'Google Ads' },
          { id: 'facebook_ads', label: 'Facebook Ads' },
          { id: 'instagram_ads', label: 'Instagram Ads' },
          { id: 'youtube_ads', label: 'YouTube Ads' },
        ]
      },
      { 
        id: 'marketplace_leads', 
        label: 'Marketplace Leads', 
        icon: Store,
        children: [
          { id: 'justdial', label: 'Justdial' },
          { id: 'indiamart', label: 'IndiaMart' },
          { id: 'tradeindia', label: 'TradeIndia' },
        ]
      },
      { id: 'referral_leads', label: 'Referral Leads', icon: Users },
      { id: 'manual_entry', label: 'Manual Entry', icon: FileText },
      { id: 'api_leads', label: 'API Leads', icon: Zap },
    ]
  },
  {
    id: 'capture',
    label: '3. Lead Capture & Routing',
    items: [
      { id: 'auto_assignment', label: 'Auto Lead Assignment', icon: GitBranch },
      { id: 'rule_distribution', label: 'Rule-Based Distribution', icon: Filter },
      { id: 'geo_routing', label: 'Country / State / City Routing', icon: Globe },
      { id: 'product_routing', label: 'Product-Based Routing', icon: Layers },
      { id: 'load_balancing', label: 'Load Balancing (Team Wise)', icon: Activity },
      { id: 'failover', label: 'Failover Assignment', icon: AlertCircle },
    ]
  },
  {
    id: 'qualification',
    label: '4. Lead Qualification',
    items: [
      { id: 'lead_scoring', label: 'Lead Scoring (AI + Manual)', icon: Brain },
      { id: 'budget_detection', label: 'Budget Detection', icon: Target },
      { id: 'intent_detection', label: 'Intent Detection', icon: Lightbulb },
      { id: 'priority_flag', label: 'Priority Flag', icon: AlertTriangle },
      { id: 'duplicate_detection', label: 'Duplicate Lead Detection', icon: Copy, badge: 23 },
    ]
  },
  {
    id: 'pipeline',
    label: '5. Lead Pipeline',
    items: [
      { id: 'stage_new', label: 'New', icon: Target, badge: 156 },
      { id: 'stage_contacted', label: 'Contacted', icon: Phone },
      { id: 'stage_interested', label: 'Interested', icon: TrendingUp },
      { id: 'stage_followup', label: 'Follow-Up', icon: Calendar },
      { id: 'stage_negotiation', label: 'Negotiation', icon: MessageSquare },
      { id: 'stage_won', label: 'Won', icon: UserCheck },
      { id: 'stage_lost', label: 'Lost', icon: XCircle },
    ]
  },
  {
    id: 'actions',
    label: '6. Lead Actions',
    items: [
      { id: 'view_lead', label: 'View', icon: Eye },
      { id: 'edit_lead', label: 'Edit', icon: Edit },
      { id: 'assign_lead', label: 'Assign', icon: UserCog },
      { id: 'reassign_lead', label: 'Reassign', icon: GitBranch },
      { id: 'call_lead', label: 'Call', icon: Phone },
      { id: 'whatsapp_lead', label: 'WhatsApp', icon: MessageCircle },
      { id: 'email_lead', label: 'Email', icon: Mail },
      { id: 'schedule_followup', label: 'Schedule Follow-Up', icon: Calendar },
      { id: 'convert_client', label: 'Convert to Client', icon: UserCheck },
      { id: 'mark_lost', label: 'Mark Lost', icon: XCircle },
    ]
  },
  {
    id: 'automation',
    label: '7. Automation & AI',
    items: [
      { id: 'auto_followup', label: 'Auto Follow-Up Suggestions', icon: Bot },
      { id: 'best_time', label: 'Best Time to Call', icon: Clock },
      { id: 'response_prediction', label: 'Response Prediction', icon: Brain },
      { id: 'dropoff_alert', label: 'Drop-Off Alert', icon: AlertTriangle, badge: 8 },
      { id: 'conversion_probability', label: 'Conversion Probability', icon: TrendingUp },
    ]
  },
  {
    id: 'team',
    label: '8. Team Management',
    items: [
      { id: 'sales_team', label: 'Sales Team List', icon: Users },
      { id: 'availability', label: 'Availability Status', icon: Activity },
      { id: 'performance', label: 'Performance Tracking', icon: BarChart3 },
      { id: 'lead_load', label: 'Lead Load Per Agent', icon: Layers },
      { id: 'escalation_rules', label: 'Escalation Rules', icon: AlertCircle },
    ]
  },
  {
    id: 'alerts',
    label: '9. Alerts & Notifications',
    items: [
      { id: 'new_lead_alert', label: 'New Lead Alert', icon: Bell, badge: 12 },
      { id: 'idle_alert', label: 'Idle Lead Alert', icon: Clock, badge: 5 },
      { id: 'sla_breach', label: 'SLA Breach Alert', icon: AlertTriangle, badge: 3 },
      { id: 'duplicate_alert', label: 'Duplicate Lead Alert', icon: Copy },
      { id: 'high_value_alert', label: 'High-Value Lead Alert', icon: Target, badge: 7 },
    ]
  },
  {
    id: 'reports',
    label: '10. Reports & Analytics',
    items: [
      { id: 'source_report', label: 'Source Wise Report', icon: FileBarChart },
      { id: 'agent_performance', label: 'Agent Wise Performance', icon: BarChart3 },
      { id: 'conversion_funnel', label: 'Conversion Funnel', icon: TrendingUp },
      { id: 'lost_analysis', label: 'Lost Reason Analysis', icon: XCircle },
      { id: 'export_reports', label: 'Export CSV / PDF', icon: FileText },
    ]
  },
  {
    id: 'integrations',
    label: '11. Integrations',
    items: [
      { id: 'crm_sync', label: 'CRM Sync', icon: Link },
      { id: 'whatsapp_api', label: 'WhatsApp API', icon: MessageCircle },
      { id: 'email_api', label: 'Email API', icon: Mail },
      { id: 'call_api', label: 'Call API', icon: Phone },
      { id: 'form_api', label: 'Website Form API', icon: Plug },
    ]
  },
  {
    id: 'security',
    label: '12. Security & Compliance',
    items: [
      { id: 'access_control', label: 'Lead Access Control', icon: Shield },
      { id: 'masked_info', label: 'Masked Contact Info', icon: Lock },
      { id: 'export_lock', label: 'Export Permission Lock', icon: Lock },
      { id: 'audit_logs', label: 'Audit Logs', icon: FileSearch },
    ]
  },
  {
    id: 'settings',
    label: '13. Settings',
    items: [
      { id: 'status_rules', label: 'Lead Status Rules', icon: Settings },
      { id: 'assignment_rules', label: 'Auto Assignment Rules', icon: GitBranch },
      { id: 'notification_settings', label: 'Notification Settings', icon: Bell },
      { id: 'working_hours', label: 'Working Hours', icon: Clock },
      { id: 'expiry_policy', label: 'Lead Expiry Policy', icon: Calendar },
    ]
  },
];

const LMFullSidebar = ({ activeSection, onSectionChange }: LMFullSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview', 'sources']);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleItem = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col z-50"
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Target className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Lead Manager</h1>
            <p className="text-xs text-muted-foreground">Enterprise System</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-3 border-b border-border">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-lg font-bold text-primary">3,717</p>
            <p className="text-xs text-muted-foreground">Total Leads</p>
          </div>
          <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <p className="text-lg font-bold text-green-500">24.8%</p>
            </div>
            <p className="text-xs text-muted-foreground">Conversion</p>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          {sidebarSections.map((section) => {
            const isSectionExpanded = expandedSections.includes(section.id);
            
            return (
              <div key={section.id} className="space-y-0.5">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>{section.label}</span>
                  {isSectionExpanded ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </button>

                {/* Section Items */}
                {isSectionExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-0.5"
                  >
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeSection === item.id;
                      const hasChildren = 'children' in item && item.children;
                      const isItemExpanded = expandedItems.includes(item.id);

                      return (
                        <div key={item.id}>
                          <motion.button
                            onClick={() => {
                              if (hasChildren) {
                                toggleItem(item.id);
                              }
                              onSectionChange(item.id);
                            }}
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-xs ${
                              isActive
                                ? 'bg-primary/15 text-primary border border-primary/30'
                                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                            }`}
                          >
                            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : ''}`} />
                            <span className="font-medium flex-1 text-left">{item.label}</span>
                            {item.badge && (
                              <Badge 
                                variant="secondary" 
                                className="text-[10px] px-1 py-0 h-4 bg-primary/20 text-primary border-primary/30"
                              >
                                {item.badge}
                              </Badge>
                            )}
                            {hasChildren && (
                              isItemExpanded 
                                ? <ChevronDown className="w-3 h-3" />
                                : <ChevronRight className="w-3 h-3" />
                            )}
                          </motion.button>

                          {/* Children Items */}
                          {hasChildren && isItemExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="ml-4 pl-2 border-l border-border/50 mt-0.5 space-y-0.5"
                            >
                              {item.children.map((child: any) => (
                                <button
                                  key={child.id}
                                  onClick={() => onSectionChange(child.id)}
                                  className={`w-full text-left px-2 py-1 text-[11px] rounded transition-colors ${
                                    activeSection === child.id
                                      ? 'text-primary bg-primary/10'
                                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                  }`}
                                >
                                  {child.label}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <div className="p-2 rounded-lg bg-accent/50 border border-border">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-muted-foreground">AI Scoring Active</span>
          </div>
          <div className="flex items-center gap-2 text-xs mt-1">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-muted-foreground">Auto-Routing Enabled</span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default LMFullSidebar;
