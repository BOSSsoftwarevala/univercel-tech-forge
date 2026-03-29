import React, { useState, useEffect } from 'react';
import { 
  Target, Phone, MessageCircle, CheckCircle, Shield, Brain, 
  Eye, EyeOff, AlertTriangle, Clock, MapPin, Zap, Flag,
  TrendingUp, UserCheck, Globe, Bell, Lock, Calendar, Users, UserPlus, Handshake
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { maskData } from '@/utils/dataMasking';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

// Team Members Data
interface TeamMember {
  id: string;
  name: string;
  role: string;
  activeLeads: number;
  status: 'online' | 'offline' | 'busy';
}

const teamMembers: TeamMember[] = [
  { id: 't1', name: 'Vikram Singh', role: 'Sales Executive', activeLeads: 8, status: 'online' },
  { id: 't2', name: 'Neha Patel', role: 'Sales Executive', activeLeads: 5, status: 'online' },
  { id: 't3', name: 'Rahul Sharma', role: 'Junior Executive', activeLeads: 3, status: 'busy' },
  { id: 't4', name: 'Priya Verma', role: 'Senior Executive', activeLeads: 12, status: 'online' },
];

// Resellers Data
interface Reseller {
  id: string;
  name: string;
  company: string;
  territory: string;
  activeLeads: number;
  rating: number;
}

const resellers: Reseller[] = [
  { id: 'r1', name: 'Tech Solutions', company: 'Tech Solutions Pvt Ltd', territory: 'Mumbai West', activeLeads: 15, rating: 4.8 },
  { id: 'r2', name: 'Digital Partners', company: 'Digital Partners India', territory: 'Mumbai Central', activeLeads: 10, rating: 4.5 },
  { id: 'r3', name: 'Growth Hub', company: 'Growth Hub Services', territory: 'Mumbai East', activeLeads: 8, rating: 4.2 },
];

interface SmartLead {
  id: string;
  name: string;
  maskedName: string;
  phone: string;
  maskedPhone: string;
  email: string;
  maskedEmail: string;
  area: string;
  status: 'new' | 'followup' | 'active' | 'converted' | 'lost';
  source: string;
  time: string;
  // AI Intelligence
  intentScore: number;
  purchaseProbability: 'high' | 'medium' | 'low';
  bestContactTime: string;
  preferredLanguage: string;
  riskLevel: 'safe' | 'caution' | 'risk';
  // Territory
  isInTerritory: boolean;
  paymentVerified: boolean;
  // Assignment
  assignedTo?: string;
  assignedType?: 'team' | 'reseller';
}

const smartLeads: SmartLead[] = [
  { 
    id: '1', name: 'Rajesh Kumar', maskedName: 'R**** K****', 
    phone: '+91 9876545678', maskedPhone: '+91 ******678',
    email: 'rajesh@email.com', maskedEmail: 'r***@***.com',
    area: 'Mumbai, Andheri West',
    status: 'new', source: 'Website', time: '10 min ago',
    intentScore: 85, purchaseProbability: 'high', bestContactTime: '10 AM - 12 PM',
    preferredLanguage: 'Hindi', riskLevel: 'safe', isInTerritory: true, paymentVerified: true
  },
  { 
    id: '2', name: 'Priya Sharma', maskedName: 'P**** S****', 
    phone: '+91 8712312345', maskedPhone: '+91 ******345',
    email: 'priya.s@mail.com', maskedEmail: 'p***@***.com',
    area: 'Mumbai, Bandra',
    status: 'followup', source: 'Meta Ad', time: '1 hour ago',
    intentScore: 72, purchaseProbability: 'medium', bestContactTime: '2 PM - 4 PM',
    preferredLanguage: 'English', riskLevel: 'safe', isInTerritory: true, paymentVerified: true
  },
  { 
    id: '3', name: 'Amit Patel', maskedName: 'A*** P****', 
    phone: '+91 9967890123', maskedPhone: '+91 ******123',
    email: 'amit.p@company.in', maskedEmail: 'a***@***.in',
    area: 'Mumbai, Goregaon',
    status: 'active', source: 'Google', time: '2 hours ago',
    intentScore: 91, purchaseProbability: 'high', bestContactTime: '11 AM - 1 PM',
    preferredLanguage: 'Gujarati', riskLevel: 'safe', isInTerritory: true, paymentVerified: true
  },
  { 
    id: '4', name: 'Sneha Gupta', maskedName: 'S**** G****', 
    phone: '+91 9134567890', maskedPhone: '+91 ******890',
    email: 'sneha.g@domain.com', maskedEmail: 's***@***.com',
    area: 'Mumbai, Malad',
    status: 'converted', source: 'Referral', time: 'Yesterday',
    intentScore: 95, purchaseProbability: 'high', bestContactTime: 'Converted',
    preferredLanguage: 'Hindi', riskLevel: 'safe', isInTerritory: true, paymentVerified: true
  },
  { 
    id: '5', name: 'Unknown Lead', maskedName: 'U****** L***', 
    phone: '+91 8823456789', maskedPhone: '+91 ******789',
    email: 'unknown@temp.com', maskedEmail: 'u***@***.com',
    area: 'Pune, Kothrud',
    status: 'new', source: 'Website', time: '3 hours ago',
    intentScore: 25, purchaseProbability: 'low', bestContactTime: 'N/A',
    preferredLanguage: 'Unknown', riskLevel: 'risk', isInTerritory: false, paymentVerified: false
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'new': return { color: 'bg-blue-500', label: 'New', icon: Zap };
    case 'followup': return { color: 'bg-amber-500', label: 'Follow-up', icon: Clock };
    case 'active': return { color: 'bg-purple-500', label: 'Active', icon: UserCheck };
    case 'converted': return { color: 'bg-emerald-500', label: 'Converted', icon: CheckCircle };
    case 'lost': return { color: 'bg-red-500', label: 'Lost', icon: AlertTriangle };
    default: return { color: 'bg-gray-500', label: status, icon: Target };
  }
};

const getProbabilityConfig = (prob: string) => {
  switch (prob) {
    case 'high': return { color: 'text-emerald-500', bg: 'bg-emerald-500/20', icon: TrendingUp };
    case 'medium': return { color: 'text-amber-500', bg: 'bg-amber-500/20', icon: TrendingUp };
    case 'low': return { color: 'text-red-500', bg: 'bg-red-500/20', icon: TrendingUp };
    default: return { color: 'text-gray-500', bg: 'bg-gray-500/20', icon: TrendingUp };
  }
};

const getRiskConfig = (risk: string) => {
  switch (risk) {
    case 'safe': return { color: 'text-emerald-500', label: 'Safe', icon: Shield };
    case 'caution': return { color: 'text-amber-500', label: 'Caution', icon: AlertTriangle };
    case 'risk': return { color: 'text-red-500', label: 'Risk', icon: AlertTriangle };
    default: return { color: 'text-gray-500', label: 'Unknown', icon: Shield };
  }
};

export function FULeadsScreen() {
  const [isWindowActive, setIsWindowActive] = useState(true);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [leads, setLeads] = useState(smartLeads);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assignType, setAssignType] = useState<'team' | 'reseller'>('team');
  const [leadToAssign, setLeadToAssign] = useState<string | null>(null);

  const handleAssignLead = (leadId: string, assigneeId: string, type: 'team' | 'reseller') => {
    const assigneeName = type === 'team' 
      ? teamMembers.find(m => m.id === assigneeId)?.name 
      : resellers.find(r => r.id === assigneeId)?.name;
    
    setLeads(prev => prev.map(lead => 
      lead.id === leadId 
        ? { ...lead, assignedTo: assigneeId, assignedType: type }
        : lead
    ));
    
    toast.success(`Lead assigned to ${assigneeName}`, {
      description: type === 'team' ? 'Team member notified' : 'Reseller notified'
    });
    setAssignDialogOpen(false);
    setLeadToAssign(null);
  };

  const getAssigneeName = (lead: SmartLead) => {
    if (!lead.assignedTo) return null;
    if (lead.assignedType === 'team') {
      return teamMembers.find(m => m.id === lead.assignedTo)?.name;
    }
    return resellers.find(r => r.id === lead.assignedTo)?.name;
  };

  // Anti-leak: blur on inactive window
  useEffect(() => {
    const handleVisibility = () => {
      setIsWindowActive(!document.hidden);
    };
    const handleBlur = () => setIsWindowActive(false);
    const handleFocus = () => setIsWindowActive(true);

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Disable right-click and copy
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleCopy = (e: ClipboardEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C' || e.key === 'p' || e.key === 'P' || e.key === 's' || e.key === 'S')) {
        e.preventDefault();
      }
      if (e.key === 'PrintScreen') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const canViewDetails = (lead: SmartLead) => {
    return lead.status === 'active' && lead.paymentVerified && lead.isInTerritory;
  };

  return (
    <div className={`space-y-6 transition-all duration-300 select-none ${!isWindowActive ? 'blur-xl pointer-events-none' : ''}`}>
      {/* Security Indicator */}
      {!isWindowActive && (
        <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Lock className="h-16 w-16 text-primary mx-auto" />
            <p className="text-xl font-semibold">Session Secured</p>
            <p className="text-muted-foreground">Click to continue</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Smart Lead System
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-500" />
            AI-Powered • Privacy-First • Secure
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-emerald-500 text-emerald-500">
            <Lock className="h-3 w-3 mr-1" />
            GDPR Protected
          </Badge>
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            <Brain className="h-3 w-3 mr-1" />
            AI Active
          </Badge>
        </div>
      </div>

      {/* AI Insights Bar */}
      <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 border-primary/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">AI Insights Today</p>
                <p className="text-sm text-muted-foreground">3 high-intent leads detected</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-500">85%</p>
                <p className="text-xs text-muted-foreground">Avg Intent</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-500">12</p>
                <p className="text-xs text-muted-foreground">Auto Follow-ups</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-amber-500">2</p>
                <p className="text-xs text-muted-foreground">Risk Alerts</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Summary */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <Zap className="h-6 w-6 text-blue-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-blue-500">12</p>
            <p className="text-xs">New</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-amber-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-amber-500">8</p>
            <p className="text-xs">Follow-up</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-500/10 border-purple-500/30">
          <CardContent className="p-4 text-center">
            <UserCheck className="h-6 w-6 text-purple-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-purple-500">5</p>
            <p className="text-xs">Active</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/10 border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 text-emerald-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-emerald-500">28</p>
            <p className="text-xs">Converted</p>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-red-500">2</p>
            <p className="text-xs">Risk</p>
          </CardContent>
        </Card>
      </div>

      {/* Leads List */}
      <Card className="bg-card/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Smart Leads
          </CardTitle>
          <Badge variant="outline" className="text-muted-foreground">
            <Eye className="h-3 w-3 mr-1" />
            Masked View
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leads.map((lead) => {
              const statusConfig = getStatusConfig(lead.status);
              const probConfig = getProbabilityConfig(lead.purchaseProbability);
              const riskConfig = getRiskConfig(lead.riskLevel);
              const canView = canViewDetails(lead);
              const StatusIcon = statusConfig.icon;
              const RiskIcon = riskConfig.icon;
              const assigneeName = getAssigneeName(lead);

              return (
                <div 
                  key={lead.id} 
                  className={`p-4 bg-background/50 rounded-xl border transition-all ${
                    selectedLead === lead.id ? 'border-primary ring-1 ring-primary' : 'border-transparent'
                  } ${lead.riskLevel === 'risk' ? 'border-red-500/50' : ''}`}
                  onClick={() => setSelectedLead(lead.id)}
                >
                  {/* Main Row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full ${statusConfig.color} flex items-center justify-center`}>
                        <StatusIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-lg">{lead.maskedName}</p>
                          {!canView && <EyeOff className="h-4 w-4 text-muted-foreground" />}
                          {lead.riskLevel === 'risk' && (
                            <Badge className="bg-red-500/20 text-red-500 text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Fake Risk
                            </Badge>
                          )}
                          {/* Assignment Badge */}
                          {assigneeName && (
                            <Badge 
                              variant="outline" 
                              className={lead.assignedType === 'team' ? 'border-blue-500 text-blue-500' : 'border-purple-500 text-purple-500'}
                            >
                              {lead.assignedType === 'team' ? <Users className="h-3 w-3 mr-1" /> : <Handshake className="h-3 w-3 mr-1" />}
                              {assigneeName}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {lead.maskedPhone}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {lead.area}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{lead.time}</span>
                      <Badge className={statusConfig.color}>
                        {statusConfig.label}
                      </Badge>
                    </div>
                  </div>

                  {/* AI Intelligence Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center gap-4">
                      {/* Intent Score */}
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-primary" />
                        <div className="w-24">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>Intent</span>
                            <span className="font-medium">{lead.intentScore}%</span>
                          </div>
                          <Progress value={lead.intentScore} className="h-1.5" />
                        </div>
                      </div>

                      {/* Purchase Probability */}
                      <Badge className={`${probConfig.bg} ${probConfig.color} capitalize`}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {lead.purchaseProbability}
                      </Badge>

                      {/* Best Contact Time */}
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {lead.bestContactTime}
                      </span>

                      {/* Language */}
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {lead.preferredLanguage}
                      </span>

                      {/* Risk */}
                      <span className={`text-sm flex items-center gap-1 ${riskConfig.color}`}>
                        <RiskIcon className="h-3 w-3" />
                        {riskConfig.label}
                      </span>

                      {/* Territory */}
                      {!lead.isInTerritory && (
                        <Badge variant="outline" className="text-red-500 border-red-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          Outside Territory
                        </Badge>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        size="sm" 
                        className="bg-emerald-500 hover:bg-emerald-600"
                        disabled={lead.riskLevel === 'risk'}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-green-500 text-green-500"
                        disabled={lead.riskLevel === 'risk'}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        WhatsApp
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4 mr-1" />
                        Follow-up
                      </Button>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Convert
                      </Button>
                      
                      {/* Assign Button with Dialog */}
                      <Dialog open={assignDialogOpen && leadToAssign === lead.id} onOpenChange={(open) => {
                        setAssignDialogOpen(open);
                        if (!open) setLeadToAssign(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-blue-500 text-blue-500"
                            disabled={lead.riskLevel === 'risk'}
                            onClick={(e) => {
                              e.stopPropagation();
                              setLeadToAssign(lead.id);
                              setAssignDialogOpen(true);
                            }}
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            Assign
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <UserPlus className="h-5 w-5 text-primary" />
                              Assign Lead
                            </DialogTitle>
                            <DialogDescription>
                              Assign this lead to a team member or reseller
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4 py-4">
                            {/* Assignment Type Toggle */}
                            <div className="flex gap-2">
                              <Button
                                variant={assignType === 'team' ? 'default' : 'outline'}
                                className="flex-1"
                                onClick={() => setAssignType('team')}
                              >
                                <Users className="h-4 w-4 mr-2" />
                                My Team
                              </Button>
                              <Button
                                variant={assignType === 'reseller' ? 'default' : 'outline'}
                                className="flex-1"
                                onClick={() => setAssignType('reseller')}
                              >
                                <Handshake className="h-4 w-4 mr-2" />
                                Reseller
                              </Button>
                            </div>

                            {/* Team Members List */}
                            {assignType === 'team' && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">Select Team Member</p>
                                {teamMembers.map((member) => (
                                  <div
                                    key={member.id}
                                    className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-between"
                                    onClick={() => handleAssignLead(lead.id, member.id, 'team')}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className={`w-2 h-2 rounded-full ${
                                        member.status === 'online' ? 'bg-emerald-500' : 
                                        member.status === 'busy' ? 'bg-amber-500' : 'bg-gray-400'
                                      }`} />
                                      <div>
                                        <p className="font-medium">{member.name}</p>
                                        <p className="text-xs text-muted-foreground">{member.role}</p>
                                      </div>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                      {member.activeLeads} leads
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Resellers List */}
                            {assignType === 'reseller' && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">Select Reseller</p>
                                {resellers.map((reseller) => (
                                  <div
                                    key={reseller.id}
                                    className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-between"
                                    onClick={() => handleAssignLead(lead.id, reseller.id, 'reseller')}
                                  >
                                    <div>
                                      <p className="font-medium">{reseller.name}</p>
                                      <p className="text-xs text-muted-foreground">{reseller.territory}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs">
                                        ⭐ {reseller.rating}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {reseller.activeLeads} leads
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-500 text-red-500"
                      >
                        <Flag className="h-4 w-4 mr-1" />
                        Fake
                      </Button>
                    </div>
                  </div>

                  {/* Security Notice for Risky Leads */}
                  {lead.riskLevel === 'risk' && (
                    <div className="mt-3 p-2 bg-red-500/10 rounded-lg flex items-center gap-2 text-sm text-red-500">
                      <AlertTriangle className="h-4 w-4" />
                      <span>AI detected potential fake lead. Actions restricted.</span>
                    </div>
                  )}

                  {/* Unmask Notice */}
                  {!canView && lead.riskLevel !== 'risk' && (
                    <div className="mt-3 p-2 bg-amber-500/10 rounded-lg flex items-center gap-2 text-sm text-amber-500">
                      <Lock className="h-4 w-4" />
                      <span>Lead details masked. Activate lead to view full information.</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* AI Auto Features Notice */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">AI Auto-Features Active</p>
              <p className="text-sm text-muted-foreground">
                Auto follow-up reminders • Voice note summaries • Smart language switching • Real-time risk detection
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
