import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Server, MapPin, HeartHandshake, Headphones, Brain, ShieldCheck,
  Search, Megaphone, Target, Star, Scale, ListTodo, UserPlus, Code2,
  Lightbulb, Wallet, Users, Store, RefreshCw, Crown, UserCog, Eye,
  ChevronRight, CheckSquare, XSquare, Power, Trash2, Upload, Download,
  Mail, Lock, Unlock, Ban, UserCheck, Send, Clock, Tag, Copy, Archive,
  AlertTriangle, Settings, FileText, DollarSign, TrendingUp, Zap,
  MessageSquare, Bell, Calendar, Link, RotateCcw, PauseCircle, PlayCircle,
  UserMinus, UserX, Edit, Globe, Database, Key, Layers, GitBranch,
  Smartphone, Briefcase, Award, BarChart3, PieChart, Activity, Cpu
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BulkAction {
  name: string;
  icon: React.ReactNode;
  description: string;
  type: 'primary' | 'warning' | 'danger' | 'info';
}

interface RoleBulkActions {
  role: string;
  label: string;
  icon: React.ReactNode;
  tier: 'ownership' | 'platform' | 'management' | 'partner' | 'user';
  color: string;
  actions: BulkAction[];
}

const allRoleBulkActions: RoleBulkActions[] = [
  // GRADE 0 - OWNERSHIP
  {
    role: 'master',
    label: 'Master Admin',
    icon: <Crown className="h-5 w-5" />,
    tier: 'ownership',
    color: 'text-red-500',
    actions: [
      { name: 'Bulk Create Super Admins', icon: <UserPlus className="h-4 w-4" />, description: 'Create multiple super admin accounts', type: 'primary' },
      { name: 'Mass Role Assignment', icon: <UserCog className="h-4 w-4" />, description: 'Assign roles to multiple users at once', type: 'primary' },
      { name: 'Bulk System Lock', icon: <Lock className="h-4 w-4" />, description: 'Lock multiple modules or features', type: 'danger' },
      { name: 'Bulk System Unlock', icon: <Unlock className="h-4 w-4" />, description: 'Unlock multiple locked modules', type: 'warning' },
      { name: 'Mass Permission Override', icon: <Shield className="h-4 w-4" />, description: 'Override permissions for multiple roles', type: 'danger' },
      { name: 'Bulk Audit Export', icon: <Download className="h-4 w-4" />, description: 'Export all audit logs in bulk', type: 'info' },
      { name: 'Mass Database Backup', icon: <Database className="h-4 w-4" />, description: 'Trigger backups for all databases', type: 'primary' },
      { name: 'Bulk API Key Rotation', icon: <Key className="h-4 w-4" />, description: 'Rotate all API keys simultaneously', type: 'warning' },
    ]
  },
  // GRADE 1 - PLATFORM CONTROL
  {
    role: 'super_admin',
    label: 'Super Admin',
    icon: <Shield className="h-5 w-5" />,
    tier: 'platform',
    color: 'text-red-400',
    actions: [
      { name: 'Bulk User Activation', icon: <UserCheck className="h-4 w-4" />, description: 'Activate multiple pending users', type: 'primary' },
      { name: 'Bulk User Suspension', icon: <Ban className="h-4 w-4" />, description: 'Suspend multiple user accounts', type: 'danger' },
      { name: 'Mass Role Revocation', icon: <UserMinus className="h-4 w-4" />, description: 'Remove roles from multiple users', type: 'warning' },
      { name: 'Bulk Admin Creation', icon: <UserPlus className="h-4 w-4" />, description: 'Create multiple admin accounts', type: 'primary' },
      { name: 'Mass Module Enable/Disable', icon: <Layers className="h-4 w-4" />, description: 'Toggle modules for multiple users', type: 'info' },
      { name: 'Bulk Wallet Adjustment', icon: <Wallet className="h-4 w-4" />, description: 'Adjust wallet balances in bulk', type: 'warning' },
      { name: 'Mass Notification Send', icon: <Bell className="h-4 w-4" />, description: 'Send notifications to all users', type: 'info' },
      { name: 'Bulk Geography Assignment', icon: <Globe className="h-4 w-4" />, description: 'Assign regions to multiple managers', type: 'primary' },
    ]
  },
  {
    role: 'server_manager',
    label: 'Server Manager',
    icon: <Server className="h-5 w-5" />,
    tier: 'platform',
    color: 'text-cyan-400',
    actions: [
      { name: 'Bulk Server Restart', icon: <RotateCcw className="h-4 w-4" />, description: 'Restart multiple servers at once', type: 'warning' },
      { name: 'Mass Scaling Update', icon: <TrendingUp className="h-4 w-4" />, description: 'Update scaling policies for all servers', type: 'primary' },
      { name: 'Bulk Backup Trigger', icon: <Database className="h-4 w-4" />, description: 'Initiate backups for multiple servers', type: 'info' },
      { name: 'Mass Security Patch', icon: <Shield className="h-4 w-4" />, description: 'Apply security patches to all servers', type: 'primary' },
      { name: 'Bulk Resource Allocation', icon: <Cpu className="h-4 w-4" />, description: 'Reallocate resources across servers', type: 'info' },
      { name: 'Mass Monitoring Enable', icon: <Activity className="h-4 w-4" />, description: 'Enable monitoring for all instances', type: 'primary' },
      { name: 'Bulk SSL Certificate Update', icon: <Lock className="h-4 w-4" />, description: 'Renew SSL certificates in bulk', type: 'warning' },
      { name: 'Mass Log Purge', icon: <Trash2 className="h-4 w-4" />, description: 'Clear old logs from all servers', type: 'danger' },
    ]
  },
  {
    role: 'area_manager',
    label: 'Area Manager',
    icon: <MapPin className="h-5 w-5" />,
    tier: 'platform',
    color: 'text-orange-400',
    actions: [
      { name: 'Bulk Franchise Approval', icon: <CheckSquare className="h-4 w-4" />, description: 'Approve multiple franchise applications', type: 'primary' },
      { name: 'Mass Territory Assignment', icon: <MapPin className="h-4 w-4" />, description: 'Assign territories to multiple franchises', type: 'primary' },
      { name: 'Bulk Performance Review', icon: <BarChart3 className="h-4 w-4" />, description: 'Review performance of all franchises', type: 'info' },
      { name: 'Mass Commission Adjustment', icon: <DollarSign className="h-4 w-4" />, description: 'Adjust commissions for region', type: 'warning' },
      { name: 'Bulk Report Generation', icon: <FileText className="h-4 w-4" />, description: 'Generate reports for all areas', type: 'info' },
      { name: 'Mass Alert Broadcast', icon: <Bell className="h-4 w-4" />, description: 'Send alerts to all area users', type: 'primary' },
      { name: 'Bulk Target Setting', icon: <Target className="h-4 w-4" />, description: 'Set sales targets for all franchises', type: 'primary' },
      { name: 'Mass Audit Request', icon: <Eye className="h-4 w-4" />, description: 'Request audits for multiple franchises', type: 'warning' },
    ]
  },
  // GRADE 2 - BUSINESS MANAGEMENT
  {
    role: 'finance_manager',
    label: 'Finance Manager',
    icon: <Wallet className="h-5 w-5" />,
    tier: 'management',
    color: 'text-lime-400',
    actions: [
      { name: 'Bulk Payout Processing', icon: <Send className="h-4 w-4" />, description: 'Process multiple payout requests', type: 'primary' },
      { name: 'Mass Invoice Generation', icon: <FileText className="h-4 w-4" />, description: 'Generate invoices for all pending', type: 'info' },
      { name: 'Bulk Refund Approval', icon: <RotateCcw className="h-4 w-4" />, description: 'Approve multiple refund requests', type: 'warning' },
      { name: 'Mass Commission Calculation', icon: <DollarSign className="h-4 w-4" />, description: 'Calculate commissions for all partners', type: 'primary' },
      { name: 'Bulk Wallet Credit', icon: <Wallet className="h-4 w-4" />, description: 'Credit multiple wallets at once', type: 'primary' },
      { name: 'Mass Payment Reminder', icon: <Bell className="h-4 w-4" />, description: 'Send payment reminders in bulk', type: 'info' },
      { name: 'Bulk Tax Report Export', icon: <Download className="h-4 w-4" />, description: 'Export tax reports for all entities', type: 'info' },
      { name: 'Mass Account Reconciliation', icon: <CheckSquare className="h-4 w-4" />, description: 'Reconcile multiple accounts', type: 'primary' },
    ]
  },
  {
    role: 'legal_compliance',
    label: 'Legal Manager',
    icon: <Scale className="h-5 w-5" />,
    tier: 'management',
    color: 'text-stone-400',
    actions: [
      { name: 'Bulk Contract Generation', icon: <FileText className="h-4 w-4" />, description: 'Generate contracts for multiple users', type: 'primary' },
      { name: 'Mass Document Approval', icon: <CheckSquare className="h-4 w-4" />, description: 'Approve multiple legal documents', type: 'primary' },
      { name: 'Bulk Compliance Check', icon: <Shield className="h-4 w-4" />, description: 'Run compliance checks on all entities', type: 'info' },
      { name: 'Mass Policy Update', icon: <Edit className="h-4 w-4" />, description: 'Update policies for all users', type: 'warning' },
      { name: 'Bulk NDA Distribution', icon: <Send className="h-4 w-4" />, description: 'Send NDAs to multiple parties', type: 'primary' },
      { name: 'Mass License Renewal', icon: <RefreshCw className="h-4 w-4" />, description: 'Renew multiple licenses at once', type: 'info' },
      { name: 'Bulk Audit Trail Export', icon: <Download className="h-4 w-4" />, description: 'Export audit trails for compliance', type: 'info' },
      { name: 'Mass Terms Acceptance Reset', icon: <RotateCcw className="h-4 w-4" />, description: 'Reset terms acceptance for users', type: 'warning' },
    ]
  },
  {
    role: 'hr_manager',
    label: 'HR Manager',
    icon: <UserPlus className="h-5 w-5" />,
    tier: 'management',
    color: 'text-orange-300',
    actions: [
      { name: 'Bulk Employee Onboarding', icon: <UserPlus className="h-4 w-4" />, description: 'Onboard multiple employees at once', type: 'primary' },
      { name: 'Mass Interview Scheduling', icon: <Calendar className="h-4 w-4" />, description: 'Schedule interviews for all candidates', type: 'info' },
      { name: 'Bulk Offer Letter Send', icon: <Mail className="h-4 w-4" />, description: 'Send offer letters to multiple candidates', type: 'primary' },
      { name: 'Mass Leave Approval', icon: <CheckSquare className="h-4 w-4" />, description: 'Approve multiple leave requests', type: 'primary' },
      { name: 'Bulk Performance Review', icon: <BarChart3 className="h-4 w-4" />, description: 'Initiate reviews for all employees', type: 'info' },
      { name: 'Mass Training Assignment', icon: <Briefcase className="h-4 w-4" />, description: 'Assign training to multiple employees', type: 'primary' },
      { name: 'Bulk Document Request', icon: <FileText className="h-4 w-4" />, description: 'Request documents from all new hires', type: 'info' },
      { name: 'Mass Exit Processing', icon: <UserMinus className="h-4 w-4" />, description: 'Process multiple employee exits', type: 'warning' },
    ]
  },
  {
    role: 'performance_manager',
    label: 'Developer Manager',
    icon: <Code2 className="h-5 w-5" />,
    tier: 'management',
    color: 'text-sky-400',
    actions: [
      { name: 'Bulk Task Assignment', icon: <ListTodo className="h-4 w-4" />, description: 'Assign tasks to multiple developers', type: 'primary' },
      { name: 'Mass Code Review Request', icon: <Eye className="h-4 w-4" />, description: 'Request reviews for all pending PRs', type: 'info' },
      { name: 'Bulk Sprint Planning', icon: <Calendar className="h-4 w-4" />, description: 'Plan sprints for all teams', type: 'primary' },
      { name: 'Mass Performance Scoring', icon: <Award className="h-4 w-4" />, description: 'Score performance for all developers', type: 'info' },
      { name: 'Bulk Access Grant', icon: <Key className="h-4 w-4" />, description: 'Grant repo access to multiple devs', type: 'primary' },
      { name: 'Mass Deadline Extension', icon: <Clock className="h-4 w-4" />, description: 'Extend deadlines for multiple tasks', type: 'warning' },
      { name: 'Bulk Status Update', icon: <RefreshCw className="h-4 w-4" />, description: 'Update status for multiple projects', type: 'info' },
      { name: 'Mass Resource Reallocation', icon: <Users className="h-4 w-4" />, description: 'Reallocate developers across projects', type: 'warning' },
    ]
  },
  {
    role: 'rnd_manager',
    label: 'R&D Manager',
    icon: <Lightbulb className="h-5 w-5" />,
    tier: 'management',
    color: 'text-sky-400',
    actions: [
      { name: 'Bulk Experiment Approval', icon: <CheckSquare className="h-4 w-4" />, description: 'Approve multiple experiments', type: 'primary' },
      { name: 'Mass Research Assignment', icon: <Briefcase className="h-4 w-4" />, description: 'Assign research topics to teams', type: 'primary' },
      { name: 'Bulk Patent Filing', icon: <FileText className="h-4 w-4" />, description: 'Initiate patent filings for innovations', type: 'info' },
      { name: 'Mass Testing Trigger', icon: <Zap className="h-4 w-4" />, description: 'Trigger tests for all prototypes', type: 'primary' },
      { name: 'Bulk Resource Allocation', icon: <Cpu className="h-4 w-4" />, description: 'Allocate resources to R&D projects', type: 'info' },
      { name: 'Mass Documentation Update', icon: <Edit className="h-4 w-4" />, description: 'Update docs for all projects', type: 'info' },
      { name: 'Bulk Milestone Review', icon: <Target className="h-4 w-4" />, description: 'Review milestones for all projects', type: 'primary' },
      { name: 'Mass Budget Request', icon: <DollarSign className="h-4 w-4" />, description: 'Submit budget requests for all R&D', type: 'warning' },
    ]
  },
  {
    role: 'marketing_manager',
    label: 'Marketing Manager',
    icon: <Megaphone className="h-5 w-5" />,
    tier: 'management',
    color: 'text-fuchsia-400',
    actions: [
      { name: 'Bulk Campaign Launch', icon: <PlayCircle className="h-4 w-4" />, description: 'Launch multiple campaigns at once', type: 'primary' },
      { name: 'Mass Campaign Pause', icon: <PauseCircle className="h-4 w-4" />, description: 'Pause all active campaigns', type: 'warning' },
      { name: 'Bulk Content Scheduling', icon: <Calendar className="h-4 w-4" />, description: 'Schedule content across platforms', type: 'info' },
      { name: 'Mass Analytics Export', icon: <Download className="h-4 w-4" />, description: 'Export analytics for all campaigns', type: 'info' },
      { name: 'Bulk Budget Allocation', icon: <DollarSign className="h-4 w-4" />, description: 'Allocate budgets to campaigns', type: 'primary' },
      { name: 'Mass A/B Test Creation', icon: <GitBranch className="h-4 w-4" />, description: 'Create A/B tests for all ads', type: 'primary' },
      { name: 'Bulk UTM Generation', icon: <Link className="h-4 w-4" />, description: 'Generate UTM links in bulk', type: 'info' },
      { name: 'Mass Influencer Outreach', icon: <Send className="h-4 w-4" />, description: 'Send outreach to all influencers', type: 'primary' },
    ]
  },
  {
    role: 'demo_manager',
    label: 'Pro Manager',
    icon: <Star className="h-5 w-5" />,
    tier: 'management',
    color: 'text-amber-400',
    actions: [
      { name: 'Bulk Demo Activation', icon: <Power className="h-4 w-4" />, description: 'Activate demos for multiple users', type: 'primary' },
      { name: 'Mass Demo Extension', icon: <Clock className="h-4 w-4" />, description: 'Extend demo periods in bulk', type: 'info' },
      { name: 'Bulk Demo Expiration', icon: <XSquare className="h-4 w-4" />, description: 'Expire multiple demos at once', type: 'warning' },
      { name: 'Mass Subscription Upgrade', icon: <TrendingUp className="h-4 w-4" />, description: 'Upgrade subscriptions in bulk', type: 'primary' },
      { name: 'Bulk Access Key Generation', icon: <Key className="h-4 w-4" />, description: 'Generate access keys for demos', type: 'primary' },
      { name: 'Mass Usage Report', icon: <PieChart className="h-4 w-4" />, description: 'Generate usage reports for all demos', type: 'info' },
      { name: 'Bulk Feature Toggle', icon: <Settings className="h-4 w-4" />, description: 'Toggle features for demo users', type: 'info' },
      { name: 'Mass Feedback Request', icon: <MessageSquare className="h-4 w-4" />, description: 'Request feedback from all demo users', type: 'info' },
    ]
  },
  {
    role: 'task_manager',
    label: 'Task Manager',
    icon: <ListTodo className="h-5 w-5" />,
    tier: 'management',
    color: 'text-violet-400',
    actions: [
      { name: 'Bulk Task Creation', icon: <ListTodo className="h-4 w-4" />, description: 'Create multiple tasks at once', type: 'primary' },
      { name: 'Mass Task Assignment', icon: <Users className="h-4 w-4" />, description: 'Assign tasks to multiple developers', type: 'primary' },
      { name: 'Bulk Priority Update', icon: <AlertTriangle className="h-4 w-4" />, description: 'Update priorities for all tasks', type: 'warning' },
      { name: 'Mass Deadline Update', icon: <Clock className="h-4 w-4" />, description: 'Update deadlines in bulk', type: 'info' },
      { name: 'Bulk Status Change', icon: <RefreshCw className="h-4 w-4" />, description: 'Change status for multiple tasks', type: 'info' },
      { name: 'Mass Task Archive', icon: <Archive className="h-4 w-4" />, description: 'Archive completed tasks in bulk', type: 'info' },
      { name: 'Bulk Comment Add', icon: <MessageSquare className="h-4 w-4" />, description: 'Add comments to multiple tasks', type: 'info' },
      { name: 'Mass Task Export', icon: <Download className="h-4 w-4" />, description: 'Export all tasks to spreadsheet', type: 'info' },
    ]
  },
  {
    role: 'lead_manager',
    label: 'Lead Manager',
    icon: <Target className="h-5 w-5" />,
    tier: 'management',
    color: 'text-teal-400',
    actions: [
      { name: 'Bulk Lead Import', icon: <Upload className="h-4 w-4" />, description: 'Import leads from spreadsheet', type: 'primary' },
      { name: 'Mass Lead Assignment', icon: <Users className="h-4 w-4" />, description: 'Assign leads to multiple agents', type: 'primary' },
      { name: 'Bulk Lead Scoring', icon: <Award className="h-4 w-4" />, description: 'Score all leads automatically', type: 'info' },
      { name: 'Mass Status Update', icon: <RefreshCw className="h-4 w-4" />, description: 'Update status for multiple leads', type: 'info' },
      { name: 'Bulk Email Campaign', icon: <Mail className="h-4 w-4" />, description: 'Send emails to selected leads', type: 'primary' },
      { name: 'Mass Lead Archive', icon: <Archive className="h-4 w-4" />, description: 'Archive stale leads in bulk', type: 'warning' },
      { name: 'Bulk Tag Assignment', icon: <Tag className="h-4 w-4" />, description: 'Add tags to multiple leads', type: 'info' },
      { name: 'Mass Lead Export', icon: <Download className="h-4 w-4" />, description: 'Export leads to CSV', type: 'info' },
    ]
  },
  {
    role: 'seo_manager',
    label: 'SEO Manager',
    icon: <Search className="h-5 w-5" />,
    tier: 'management',
    color: 'text-green-400',
    actions: [
      { name: 'Bulk Keyword Research', icon: <Search className="h-4 w-4" />, description: 'Research keywords for all pages', type: 'primary' },
      { name: 'Mass Meta Update', icon: <Edit className="h-4 w-4" />, description: 'Update meta tags for all pages', type: 'primary' },
      { name: 'Bulk Sitemap Generate', icon: <Globe className="h-4 w-4" />, description: 'Generate sitemaps for all sites', type: 'info' },
      { name: 'Mass Backlink Analysis', icon: <Link className="h-4 w-4" />, description: 'Analyze backlinks for all domains', type: 'info' },
      { name: 'Bulk Page Speed Check', icon: <Zap className="h-4 w-4" />, description: 'Check speed for all pages', type: 'info' },
      { name: 'Mass Content Optimization', icon: <FileText className="h-4 w-4" />, description: 'Optimize content for all pages', type: 'primary' },
      { name: 'Bulk Rank Tracking', icon: <TrendingUp className="h-4 w-4" />, description: 'Track rankings for all keywords', type: 'info' },
      { name: 'Mass Report Export', icon: <Download className="h-4 w-4" />, description: 'Export SEO reports for all clients', type: 'info' },
    ]
  },
  {
    role: 'client_success',
    label: 'Sales & Support Manager',
    icon: <HeartHandshake className="h-5 w-5" />,
    tier: 'management',
    color: 'text-emerald-400',
    actions: [
      { name: 'Bulk Ticket Assignment', icon: <Briefcase className="h-4 w-4" />, description: 'Assign tickets to multiple agents', type: 'primary' },
      { name: 'Mass Ticket Resolution', icon: <CheckSquare className="h-4 w-4" />, description: 'Resolve multiple tickets at once', type: 'primary' },
      { name: 'Bulk Follow-up Schedule', icon: <Calendar className="h-4 w-4" />, description: 'Schedule follow-ups for all clients', type: 'info' },
      { name: 'Mass Satisfaction Survey', icon: <MessageSquare className="h-4 w-4" />, description: 'Send surveys to all clients', type: 'info' },
      { name: 'Bulk Escalation', icon: <AlertTriangle className="h-4 w-4" />, description: 'Escalate multiple tickets', type: 'warning' },
      { name: 'Mass Priority Update', icon: <Tag className="h-4 w-4" />, description: 'Update priority for all tickets', type: 'info' },
      { name: 'Bulk Response Template', icon: <Copy className="h-4 w-4" />, description: 'Apply templates to multiple tickets', type: 'info' },
      { name: 'Mass Report Generation', icon: <FileText className="h-4 w-4" />, description: 'Generate reports for all agents', type: 'info' },
    ]
  },
  {
    role: 'ai_manager',
    label: 'API / AI Manager',
    icon: <Brain className="h-5 w-5" />,
    tier: 'management',
    color: 'text-purple-400',
    actions: [
      { name: 'Bulk API Key Generation', icon: <Key className="h-4 w-4" />, description: 'Generate API keys for multiple users', type: 'primary' },
      { name: 'Mass API Key Revocation', icon: <XSquare className="h-4 w-4" />, description: 'Revoke multiple API keys', type: 'danger' },
      { name: 'Bulk Rate Limit Update', icon: <Settings className="h-4 w-4" />, description: 'Update rate limits for all APIs', type: 'warning' },
      { name: 'Mass AI Model Deployment', icon: <Upload className="h-4 w-4" />, description: 'Deploy models to all endpoints', type: 'primary' },
      { name: 'Bulk Usage Report', icon: <PieChart className="h-4 w-4" />, description: 'Generate usage reports for all APIs', type: 'info' },
      { name: 'Mass Endpoint Enable', icon: <Power className="h-4 w-4" />, description: 'Enable multiple API endpoints', type: 'primary' },
      { name: 'Bulk Cache Clear', icon: <Trash2 className="h-4 w-4" />, description: 'Clear caches for all AI services', type: 'warning' },
      { name: 'Mass Optimization Run', icon: <Zap className="h-4 w-4" />, description: 'Run optimization for all models', type: 'primary' },
    ]
  },
  {
    role: 'api_security',
    label: 'API Security Manager',
    icon: <ShieldCheck className="h-5 w-5" />,
    tier: 'management',
    color: 'text-red-400',
    actions: [
      { name: 'Bulk Security Scan', icon: <Shield className="h-4 w-4" />, description: 'Scan all APIs for vulnerabilities', type: 'primary' },
      { name: 'Mass IP Blocking', icon: <Ban className="h-4 w-4" />, description: 'Block multiple suspicious IPs', type: 'danger' },
      { name: 'Bulk Certificate Renewal', icon: <RefreshCw className="h-4 w-4" />, description: 'Renew SSL certs for all APIs', type: 'warning' },
      { name: 'Mass Access Token Rotation', icon: <Key className="h-4 w-4" />, description: 'Rotate tokens for all services', type: 'warning' },
      { name: 'Bulk Firewall Rule Update', icon: <Settings className="h-4 w-4" />, description: 'Update firewall rules in bulk', type: 'primary' },
      { name: 'Mass Threat Analysis', icon: <Eye className="h-4 w-4" />, description: 'Analyze threats across all APIs', type: 'info' },
      { name: 'Bulk Audit Log Export', icon: <Download className="h-4 w-4" />, description: 'Export security logs for all APIs', type: 'info' },
      { name: 'Mass Penetration Test', icon: <Zap className="h-4 w-4" />, description: 'Run pen tests on all endpoints', type: 'primary' },
    ]
  },
  {
    role: 'support',
    label: 'Support Manager',
    icon: <Headphones className="h-5 w-5" />,
    tier: 'management',
    color: 'text-sky-300',
    actions: [
      { name: 'Bulk Ticket Merge', icon: <Copy className="h-4 w-4" />, description: 'Merge duplicate tickets', type: 'info' },
      { name: 'Mass Auto-Response', icon: <MessageSquare className="h-4 w-4" />, description: 'Send auto-responses to all pending', type: 'primary' },
      { name: 'Bulk Agent Assignment', icon: <Users className="h-4 w-4" />, description: 'Assign agents to multiple queues', type: 'primary' },
      { name: 'Mass SLA Update', icon: <Clock className="h-4 w-4" />, description: 'Update SLA for all tickets', type: 'warning' },
      { name: 'Bulk Knowledge Article', icon: <FileText className="h-4 w-4" />, description: 'Create articles for common issues', type: 'info' },
      { name: 'Mass Ticket Tag', icon: <Tag className="h-4 w-4" />, description: 'Add tags to multiple tickets', type: 'info' },
      { name: 'Bulk Escalation Reset', icon: <RotateCcw className="h-4 w-4" />, description: 'Reset escalation timers', type: 'warning' },
      { name: 'Mass Quality Review', icon: <Award className="h-4 w-4" />, description: 'Review quality for all resolved', type: 'info' },
    ]
  },
  {
    role: 'safe_assist',
    label: 'Safe Assist',
    icon: <Eye className="h-5 w-5" />,
    tier: 'management',
    color: 'text-indigo-400',
    actions: [
      { name: 'Bulk Session Start', icon: <PlayCircle className="h-4 w-4" />, description: 'Start assist sessions for multiple users', type: 'primary' },
      { name: 'Mass Session End', icon: <XSquare className="h-4 w-4" />, description: 'End all active sessions', type: 'warning' },
      { name: 'Bulk Recording Enable', icon: <Activity className="h-4 w-4" />, description: 'Enable recording for all sessions', type: 'info' },
      { name: 'Mass Permission Grant', icon: <Key className="h-4 w-4" />, description: 'Grant permissions for multiple sessions', type: 'primary' },
      { name: 'Bulk Session Export', icon: <Download className="h-4 w-4" />, description: 'Export logs for all sessions', type: 'info' },
      { name: 'Mass AI Analysis', icon: <Brain className="h-4 w-4" />, description: 'Run AI analysis on all sessions', type: 'info' },
      { name: 'Bulk Session Archive', icon: <Archive className="h-4 w-4" />, description: 'Archive completed sessions', type: 'info' },
      { name: 'Mass Violation Report', icon: <AlertTriangle className="h-4 w-4" />, description: 'Generate violation reports', type: 'warning' },
    ]
  },
  {
    role: 'assist_manager',
    label: 'Assist Manager',
    icon: <UserCog className="h-5 w-5" />,
    tier: 'management',
    color: 'text-indigo-300',
    actions: [
      { name: 'Bulk Agent Approval', icon: <UserCheck className="h-4 w-4" />, description: 'Approve multiple assist agents', type: 'primary' },
      { name: 'Mass Agent Training', icon: <Briefcase className="h-4 w-4" />, description: 'Assign training to all agents', type: 'info' },
      { name: 'Bulk Performance Review', icon: <BarChart3 className="h-4 w-4" />, description: 'Review all agent performance', type: 'info' },
      { name: 'Mass Schedule Update', icon: <Calendar className="h-4 w-4" />, description: 'Update schedules for all agents', type: 'primary' },
      { name: 'Bulk Access Grant', icon: <Key className="h-4 w-4" />, description: 'Grant access to multiple agents', type: 'primary' },
      { name: 'Mass Certification Check', icon: <Award className="h-4 w-4" />, description: 'Check certifications for all agents', type: 'info' },
      { name: 'Bulk Agent Deactivation', icon: <UserMinus className="h-4 w-4" />, description: 'Deactivate multiple agents', type: 'danger' },
      { name: 'Mass Report Generation', icon: <FileText className="h-4 w-4" />, description: 'Generate reports for all agents', type: 'info' },
    ]
  },
  {
    role: 'promise_tracker',
    label: 'Promise Tracker',
    icon: <Target className="h-5 w-5" />,
    tier: 'management',
    color: 'text-rose-400',
    actions: [
      { name: 'Bulk Promise Import', icon: <Upload className="h-4 w-4" />, description: 'Import promises from spreadsheet', type: 'primary' },
      { name: 'Mass Status Update', icon: <RefreshCw className="h-4 w-4" />, description: 'Update status for all promises', type: 'info' },
      { name: 'Bulk Deadline Alert', icon: <Bell className="h-4 w-4" />, description: 'Send alerts for overdue promises', type: 'warning' },
      { name: 'Mass Promise Assignment', icon: <Users className="h-4 w-4" />, description: 'Assign promises to developers', type: 'primary' },
      { name: 'Bulk Evidence Request', icon: <FileText className="h-4 w-4" />, description: 'Request evidence for all promises', type: 'info' },
      { name: 'Mass Promise Archive', icon: <Archive className="h-4 w-4" />, description: 'Archive completed promises', type: 'info' },
      { name: 'Bulk Report Export', icon: <Download className="h-4 w-4" />, description: 'Export promise reports', type: 'info' },
      { name: 'Mass Priority Update', icon: <AlertTriangle className="h-4 w-4" />, description: 'Update priorities for all promises', type: 'warning' },
    ]
  },
  {
    role: 'promise_management',
    label: 'Promise Management',
    icon: <Briefcase className="h-5 w-5" />,
    tier: 'management',
    color: 'text-rose-300',
    actions: [
      { name: 'Bulk Commitment Creation', icon: <FileText className="h-4 w-4" />, description: 'Create multiple commitments', type: 'primary' },
      { name: 'Mass Stakeholder Notification', icon: <Bell className="h-4 w-4" />, description: 'Notify all stakeholders', type: 'info' },
      { name: 'Bulk Milestone Setting', icon: <Target className="h-4 w-4" />, description: 'Set milestones for all commitments', type: 'primary' },
      { name: 'Mass Progress Update', icon: <TrendingUp className="h-4 w-4" />, description: 'Update progress for all items', type: 'info' },
      { name: 'Bulk Resource Allocation', icon: <Users className="h-4 w-4" />, description: 'Allocate resources to commitments', type: 'primary' },
      { name: 'Mass Risk Assessment', icon: <AlertTriangle className="h-4 w-4" />, description: 'Assess risks for all commitments', type: 'warning' },
      { name: 'Bulk Report Generation', icon: <FileText className="h-4 w-4" />, description: 'Generate commitment reports', type: 'info' },
      { name: 'Mass Closure Processing', icon: <CheckSquare className="h-4 w-4" />, description: 'Close completed commitments', type: 'primary' },
    ]
  },
  // GRADE 3 - PARTNERS
  {
    role: 'franchise',
    label: 'Franchise',
    icon: <Store className="h-5 w-5" />,
    tier: 'partner',
    color: 'text-amber-400',
    actions: [
      { name: 'Bulk Lead Claim', icon: <Target className="h-4 w-4" />, description: 'Claim multiple available leads', type: 'primary' },
      { name: 'Mass Demo Schedule', icon: <Calendar className="h-4 w-4" />, description: 'Schedule demos for multiple leads', type: 'primary' },
      { name: 'Bulk Invoice Generate', icon: <FileText className="h-4 w-4" />, description: 'Generate invoices for all sales', type: 'info' },
      { name: 'Mass Follow-up Send', icon: <Mail className="h-4 w-4" />, description: 'Send follow-ups to all leads', type: 'info' },
      { name: 'Bulk Status Update', icon: <RefreshCw className="h-4 w-4" />, description: 'Update lead statuses in bulk', type: 'info' },
      { name: 'Mass Report Export', icon: <Download className="h-4 w-4" />, description: 'Export sales reports', type: 'info' },
      { name: 'Bulk Team Assignment', icon: <Users className="h-4 w-4" />, description: 'Assign leads to team members', type: 'primary' },
      { name: 'Mass Ticket Creation', icon: <Headphones className="h-4 w-4" />, description: 'Create support tickets for issues', type: 'info' },
    ]
  },
  {
    role: 'developer',
    label: 'Developer',
    icon: <Code2 className="h-5 w-5" />,
    tier: 'partner',
    color: 'text-emerald-400',
    actions: [
      { name: 'Bulk Task Accept', icon: <CheckSquare className="h-4 w-4" />, description: 'Accept multiple assigned tasks', type: 'primary' },
      { name: 'Mass Status Update', icon: <RefreshCw className="h-4 w-4" />, description: 'Update status for all tasks', type: 'info' },
      { name: 'Bulk Time Log', icon: <Clock className="h-4 w-4" />, description: 'Log time for multiple tasks', type: 'info' },
      { name: 'Mass PR Submission', icon: <GitBranch className="h-4 w-4" />, description: 'Submit PRs for all completed tasks', type: 'primary' },
      { name: 'Bulk Comment Add', icon: <MessageSquare className="h-4 w-4" />, description: 'Add comments to multiple tasks', type: 'info' },
      { name: 'Mass Evidence Upload', icon: <Upload className="h-4 w-4" />, description: 'Upload evidence for all tasks', type: 'info' },
      { name: 'Bulk Notification Clear', icon: <Bell className="h-4 w-4" />, description: 'Clear all notifications', type: 'info' },
      { name: 'Mass Report Download', icon: <Download className="h-4 w-4" />, description: 'Download all task reports', type: 'info' },
    ]
  },
  {
    role: 'reseller',
    label: 'Reseller',
    icon: <RefreshCw className="h-5 w-5" />,
    tier: 'partner',
    color: 'text-cyan-400',
    actions: [
      { name: 'Bulk Client Addition', icon: <UserPlus className="h-4 w-4" />, description: 'Add multiple clients at once', type: 'primary' },
      { name: 'Mass License Assignment', icon: <Key className="h-4 w-4" />, description: 'Assign licenses to all clients', type: 'primary' },
      { name: 'Bulk Invoice Generate', icon: <FileText className="h-4 w-4" />, description: 'Generate invoices for all clients', type: 'info' },
      { name: 'Mass Payment Reminder', icon: <Bell className="h-4 w-4" />, description: 'Send reminders to all clients', type: 'info' },
      { name: 'Bulk Subscription Renew', icon: <RefreshCw className="h-4 w-4" />, description: 'Renew subscriptions in bulk', type: 'primary' },
      { name: 'Mass Support Ticket', icon: <Headphones className="h-4 w-4" />, description: 'Create tickets for client issues', type: 'info' },
      { name: 'Bulk Report Export', icon: <Download className="h-4 w-4" />, description: 'Export all reseller reports', type: 'info' },
      { name: 'Mass Commission Check', icon: <DollarSign className="h-4 w-4" />, description: 'Check commission for all sales', type: 'info' },
    ]
  },
  {
    role: 'influencer',
    label: 'Influencer',
    icon: <Smartphone className="h-5 w-5" />,
    tier: 'partner',
    color: 'text-pink-400',
    actions: [
      { name: 'Bulk Content Schedule', icon: <Calendar className="h-4 w-4" />, description: 'Schedule posts for all platforms', type: 'primary' },
      { name: 'Mass Link Generation', icon: <Link className="h-4 w-4" />, description: 'Generate referral links in bulk', type: 'primary' },
      { name: 'Bulk Analytics Export', icon: <Download className="h-4 w-4" />, description: 'Export analytics for all posts', type: 'info' },
      { name: 'Mass Commission Check', icon: <DollarSign className="h-4 w-4" />, description: 'Check earnings for all referrals', type: 'info' },
      { name: 'Bulk Content Download', icon: <Download className="h-4 w-4" />, description: 'Download marketing materials', type: 'info' },
      { name: 'Mass Performance Report', icon: <BarChart3 className="h-4 w-4" />, description: 'Generate performance reports', type: 'info' },
      { name: 'Bulk Campaign Join', icon: <Target className="h-4 w-4" />, description: 'Join multiple campaigns at once', type: 'primary' },
      { name: 'Mass Payout Request', icon: <Wallet className="h-4 w-4" />, description: 'Request payouts for all earnings', type: 'primary' },
    ]
  },
  // GRADE 4 - USERS
  {
    role: 'prime',
    label: 'Prime User',
    icon: <Star className="h-5 w-5" />,
    tier: 'user',
    color: 'text-yellow-400',
    actions: [
      { name: 'Bulk Demo Access', icon: <PlayCircle className="h-4 w-4" />, description: 'Request access to multiple demos', type: 'primary' },
      { name: 'Mass Favorite Add', icon: <Star className="h-4 w-4" />, description: 'Add multiple products to favorites', type: 'info' },
      { name: 'Bulk Support Ticket', icon: <Headphones className="h-4 w-4" />, description: 'Create tickets for multiple issues', type: 'info' },
      { name: 'Mass Document Download', icon: <Download className="h-4 w-4" />, description: 'Download all available documents', type: 'info' },
      { name: 'Bulk Notification Setting', icon: <Bell className="h-4 w-4" />, description: 'Update notification preferences', type: 'info' },
      { name: 'Mass Feedback Submit', icon: <MessageSquare className="h-4 w-4" />, description: 'Submit feedback for all demos', type: 'info' },
      { name: 'Bulk Subscription Check', icon: <CheckSquare className="h-4 w-4" />, description: 'Check all subscription statuses', type: 'info' },
      { name: 'Mass Export Request', icon: <Download className="h-4 w-4" />, description: 'Request export of all data', type: 'info' },
    ]
  },
  {
    role: 'client',
    label: 'Client',
    icon: <Users className="h-5 w-5" />,
    tier: 'user',
    color: 'text-blue-400',
    actions: [
      { name: 'Bulk Invoice Download', icon: <Download className="h-4 w-4" />, description: 'Download all invoices', type: 'info' },
      { name: 'Mass Support Ticket', icon: <Headphones className="h-4 w-4" />, description: 'Create multiple support tickets', type: 'info' },
      { name: 'Bulk User Addition', icon: <UserPlus className="h-4 w-4" />, description: 'Add multiple team users', type: 'primary' },
      { name: 'Mass Permission Update', icon: <Key className="h-4 w-4" />, description: 'Update permissions for team', type: 'info' },
      { name: 'Bulk Document Access', icon: <FileText className="h-4 w-4" />, description: 'Request access to documents', type: 'info' },
      { name: 'Mass Notification Clear', icon: <Bell className="h-4 w-4" />, description: 'Clear all notifications', type: 'info' },
      { name: 'Bulk Report Download', icon: <Download className="h-4 w-4" />, description: 'Download all available reports', type: 'info' },
      { name: 'Mass Data Export', icon: <Download className="h-4 w-4" />, description: 'Export all client data', type: 'info' },
    ]
  },
];

const tierConfig = {
  ownership: { label: 'Grade 0 - Ownership', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  platform: { label: 'Grade 1 - Platform Control', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  management: { label: 'Grade 2 - Business Management', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  partner: { label: 'Grade 3 - Partners', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  user: { label: 'Grade 4 - Users', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
};

const BulkActionsReference = () => {
  const [selectedRole, setSelectedRole] = useState<string>('master');
  const [selectedTier, setSelectedTier] = useState<string>('all');

  const currentRole = allRoleBulkActions.find(r => r.role === selectedRole) || allRoleBulkActions[0];
  
  const filteredRoles = selectedTier === 'all' 
    ? allRoleBulkActions 
    : allRoleBulkActions.filter(r => r.tier === selectedTier);

  const getActionTypeColor = (type: BulkAction['type']) => {
    switch (type) {
      case 'primary': return 'bg-primary/20 text-primary border-primary/30';
      case 'warning': return 'bg-neon-orange/20 text-neon-orange border-neon-orange/30';
      case 'danger': return 'bg-neon-red/20 text-neon-red border-neon-red/30';
      case 'info': return 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
            <Layers className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Bulk Actions Reference</h1>
            <p className="text-sm text-muted-foreground">All {allRoleBulkActions.length} Roles • {allRoleBulkActions.reduce((acc, r) => acc + r.actions.length, 0)} Total Actions</p>
          </div>
        </div>
      </motion.div>

      {/* Tier Filter */}
      <div className="mb-6">
        <Tabs value={selectedTier} onValueChange={setSelectedTier}>
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="all">All Grades</TabsTrigger>
            <TabsTrigger value="ownership">G0 - Ownership</TabsTrigger>
            <TabsTrigger value="platform">G1 - Platform</TabsTrigger>
            <TabsTrigger value="management">G2 - Management</TabsTrigger>
            <TabsTrigger value="partner">G3 - Partners</TabsTrigger>
            <TabsTrigger value="user">G4 - Users</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left - Role List */}
        <div className="col-span-4">
          <Card className="glass-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                {filteredRoles.length} Roles
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="space-y-1">
                  {filteredRoles.map((role, index) => (
                    <motion.button
                      key={role.role}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => setSelectedRole(role.role)}
                      className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all ${
                        selectedRole === role.role
                          ? 'bg-primary/20 border border-primary/40'
                          : 'hover:bg-secondary/50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg bg-secondary/50 ${role.color}`}>
                        {role.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-foreground">{role.label}</p>
                        <p className="text-xs text-muted-foreground">{role.actions.length} actions</p>
                      </div>
                      <Badge variant="outline" className={tierConfig[role.tier].color}>
                        G{role.tier === 'ownership' ? '0' : role.tier === 'platform' ? '1' : role.tier === 'management' ? '2' : role.tier === 'partner' ? '3' : '4'}
                      </Badge>
                      <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${
                        selectedRole === role.role ? 'rotate-90' : ''
                      }`} />
                    </motion.button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right - Actions List */}
        <div className="col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRole.role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="glass-panel">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-secondary/50 ${currentRole.color}`}>
                        {currentRole.icon}
                      </div>
                      <div>
                        <CardTitle>{currentRole.label}</CardTitle>
                        <p className="text-sm text-muted-foreground">{currentRole.actions.length} Bulk Actions Available</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={tierConfig[currentRole.tier].color}>
                      {tierConfig[currentRole.tier].label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {currentRole.actions.map((action, idx) => (
                      <motion.div
                        key={action.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        className={`p-4 rounded-lg border ${getActionTypeColor(action.type)} hover:scale-[1.02] transition-transform cursor-pointer`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-background/50">
                            {action.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{action.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsReference;
