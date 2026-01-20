/**
 * FRANCHISE OWNER - PLACE ORDER FORM
 * Full-screen order form with 5 sections
 * End-to-end flow with AI approval integration
 * LOCKED: Same theme/colors as core system
 */

import React, { useState, useCallback } from 'react';
import { 
  ArrowLeft, User, Globe, Server, FileCode, AlertTriangle,
  Upload, X, CheckCircle2, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface FOPlaceOrderFormProps {
  onClose: () => void;
}

interface OrderFormData {
  // Section A: Client & Project Info
  clientName: string;
  clientEmail: string;
  clientMobile: string;
  projectTitle: string;
  projectDescription: string;
  // Section B: Domain & Hosting
  domainType: 'new' | 'existing' | '';
  domainName: string;
  domainProvider: string;
  hostingType: 'client' | 'software_vala' | '';
  hostingProvider: string;
  hostingLoginId: string;
  hostingPassword: string;
  serverLocation: string;
  // Section C: Software Details
  softwareCategory: string;
  selectedSoftwareUrl: string;
  logoFile: File | null;
  referenceWebsiteUrl: string;
  additionalNotes: string;
  // Section D: File Uploads
  photoFiles: File[];
  documentFiles: File[];
  otherFiles: File[];
  // Section E: Issues/Requirements
  issueType: 'bug' | 'update' | 'new_feature' | '';
  priorityLevel: 'low' | 'medium' | 'high' | 'critical' | '';
  expectedTimeline: string;
  additionalComments: string;
}

const initialFormData: OrderFormData = {
  clientName: '',
  clientEmail: '',
  clientMobile: '',
  projectTitle: '',
  projectDescription: '',
  domainType: '',
  domainName: '',
  domainProvider: '',
  hostingType: '',
  hostingProvider: '',
  hostingLoginId: '',
  hostingPassword: '',
  serverLocation: '',
  softwareCategory: '',
  selectedSoftwareUrl: '',
  logoFile: null,
  referenceWebsiteUrl: '',
  additionalNotes: '',
  photoFiles: [],
  documentFiles: [],
  otherFiles: [],
  issueType: '',
  priorityLevel: '',
  expectedTimeline: '',
  additionalComments: '',
};

const SOFTWARE_CATEGORIES = [
  'E-Commerce',
  'CRM System',
  'ERP Solution',
  'Mobile App',
  'Web Portal',
  'Custom Software',
  'API Integration',
  'Other',
];

const SERVER_LOCATIONS = [
  'India - Mumbai',
  'India - Bangalore',
  'Singapore',
  'US - East',
  'US - West',
  'Europe - Frankfurt',
];

export function FOPlaceOrderForm({ onClose }: FOPlaceOrderFormProps) {
  const [formData, setFormData] = useState<OrderFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState(1);

  const updateField = useCallback(<K extends keyof OrderFormData>(
    field: K, 
    value: OrderFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const maskValue = (value: string, visibleChars: number = 3): string => {
    if (value.length <= visibleChars) return value;
    return value.slice(0, visibleChars) + '•'.repeat(value.length - visibleChars);
  };

  const handleFileUpload = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'logoFile' | 'photoFiles' | 'documentFiles' | 'otherFiles'
  ) => {
    const files = e.target.files;
    if (!files) return;

    if (field === 'logoFile') {
      updateField(field, files[0] || null);
    } else {
      const currentFiles = formData[field] as File[];
      updateField(field, [...currentFiles, ...Array.from(files)]);
    }
  }, [formData, updateField]);

  const removeFile = useCallback((field: 'photoFiles' | 'documentFiles' | 'otherFiles', index: number) => {
    const currentFiles = formData[field] as File[];
    updateField(field, currentFiles.filter((_, i) => i !== index));
  }, [formData, updateField]);

  const validateForm = (): boolean => {
    // Section A validation
    if (!formData.clientName.trim()) {
      toast.error('Client name is required');
      setActiveSection(1);
      return false;
    }
    if (!formData.clientEmail.trim()) {
      toast.error('Client email is required');
      setActiveSection(1);
      return false;
    }
    if (!formData.projectTitle.trim()) {
      toast.error('Project title is required');
      setActiveSection(1);
      return false;
    }
    if (formData.projectDescription.trim().split(/\s+/).length < 100) {
      toast.error('Project description must be at least 100 words');
      setActiveSection(1);
      return false;
    }
    // Section B validation
    if (!formData.domainName.trim()) {
      toast.error('Domain name is required');
      setActiveSection(2);
      return false;
    }
    // Section C validation
    if (!formData.softwareCategory) {
      toast.error('Software category is required');
      setActiveSection(3);
      return false;
    }
    return true;
  };

  const generateProjectId = (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `PRJ-${year}${month}-${random}`;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const projectId = generateProjectId();

    try {
      // Insert into client_projects table
      const { error: projectError } = await supabase
        .from('client_projects')
        .insert({
          client_name: formData.clientName,
          client_email: formData.clientEmail,
          client_phone: formData.clientMobile,
          domain_name: formData.domainName,
          project_type: formData.softwareCategory,
          requirements: formData.projectDescription,
          status: 'pending_ai_approval',
          status_message: 'Awaiting AI analysis and approval',
        });

      if (projectError) throw projectError;

      // Log to audit_logs
      const { error: auditError } = await supabase
        .from('audit_logs')
        .insert({
          action: 'PROJECT_ORDER_SUBMITTED',
          module: 'franchise_owner',
          meta_json: {
            project_id: projectId,
            client_name: formData.clientName,
            software_category: formData.softwareCategory,
            priority: formData.priorityLevel,
          },
        });

      if (auditError) {
        console.error('Audit log error:', auditError);
      }

      toast.success(
        <div className="space-y-1">
          <p className="font-semibold">Order Submitted Successfully!</p>
          <p className="text-sm">Project ID: {projectId}</p>
          <p className="text-xs text-muted-foreground">Status: Pending AI Approval</p>
        </div>
      );

      onClose();
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sections = [
    { id: 1, title: 'Client & Project', icon: User },
    { id: 2, title: 'Domain & Hosting', icon: Globe },
    { id: 3, title: 'Software Details', icon: FileCode },
    { id: 4, title: 'File Upload', icon: Upload },
    { id: 5, title: 'Issues/Requirements', icon: AlertTriangle },
  ];

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Place New Order</h1>
            <p className="text-xs text-muted-foreground">Complete all sections to submit</p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          AI Approval Required
        </Badge>
      </div>

      {/* Section Tabs */}
      <div className="shrink-0 flex items-center gap-2 p-3 bg-muted/30 border-b border-border overflow-x-auto">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeSection === section.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border'
            }`}
          >
            <section.icon className="h-4 w-4" />
            {section.title}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 max-w-4xl mx-auto">
          {/* Section A: Client & Project Info */}
          {activeSection === 1 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4 text-primary" />
                  Section A: Client & Project Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name *</Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => updateField('clientName', e.target.value)}
                      placeholder="Enter client name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">Client Email * (Masked View)</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => updateField('clientEmail', e.target.value)}
                      placeholder="client@example.com"
                    />
                    {formData.clientEmail && (
                      <p className="text-xs text-muted-foreground">Display: {maskValue(formData.clientEmail, 4)}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientMobile">Client Mobile (Masked View)</Label>
                    <Input
                      id="clientMobile"
                      value={formData.clientMobile}
                      onChange={(e) => updateField('clientMobile', e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                    />
                    {formData.clientMobile && (
                      <p className="text-xs text-muted-foreground">Display: {maskValue(formData.clientMobile, 4)}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectTitle">Project Title *</Label>
                    <Input
                      id="projectTitle"
                      value={formData.projectTitle}
                      onChange={(e) => updateField('projectTitle', e.target.value)}
                      placeholder="Enter project title"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectDescription">
                    Project Description * (Min 100 words)
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({formData.projectDescription.trim().split(/\s+/).filter(Boolean).length}/100 words)
                    </span>
                  </Label>
                  <Textarea
                    id="projectDescription"
                    value={formData.projectDescription}
                    onChange={(e) => updateField('projectDescription', e.target.value)}
                    placeholder="Describe the project requirements in detail..."
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section B: Domain & Hosting */}
          {activeSection === 2 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Globe className="h-4 w-4 text-primary" />
                  Section B: Domain & Hosting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Domain Type</Label>
                    <Select 
                      value={formData.domainType} 
                      onValueChange={(v) => updateField('domainType', v as 'new' | 'existing')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select domain type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New Domain</SelectItem>
                        <SelectItem value="existing">Existing Domain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domainName">Domain Name *</Label>
                    <Input
                      id="domainName"
                      value={formData.domainName}
                      onChange={(e) => updateField('domainName', e.target.value)}
                      placeholder="example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domainProvider">Domain Provider</Label>
                    <Input
                      id="domainProvider"
                      value={formData.domainProvider}
                      onChange={(e) => updateField('domainProvider', e.target.value)}
                      placeholder="GoDaddy, Namecheap, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hosting Type</Label>
                    <Select 
                      value={formData.hostingType} 
                      onValueChange={(v) => updateField('hostingType', v as 'client' | 'software_vala')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select hosting type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Client Hosting</SelectItem>
                        <SelectItem value="software_vala">Software Vala Hosting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hostingProvider">Hosting Provider</Label>
                    <Input
                      id="hostingProvider"
                      value={formData.hostingProvider}
                      onChange={(e) => updateField('hostingProvider', e.target.value)}
                      placeholder="AWS, DigitalOcean, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hostingLoginId">Hosting Login ID (Encrypted)</Label>
                    <Input
                      id="hostingLoginId"
                      value={formData.hostingLoginId}
                      onChange={(e) => updateField('hostingLoginId', e.target.value)}
                      placeholder="Login ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hostingPassword">Hosting Password (Encrypted)</Label>
                    <Input
                      id="hostingPassword"
                      type="password"
                      value={formData.hostingPassword}
                      onChange={(e) => updateField('hostingPassword', e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Server Location</Label>
                    <Select 
                      value={formData.serverLocation} 
                      onValueChange={(v) => updateField('serverLocation', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select server location" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVER_LOCATIONS.map((loc) => (
                          <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section C: Software Details */}
          {activeSection === 3 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileCode className="h-4 w-4 text-primary" />
                  Section C: Software Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Software Category *</Label>
                    <Select 
                      value={formData.softwareCategory} 
                      onValueChange={(v) => updateField('softwareCategory', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {SOFTWARE_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="selectedSoftwareUrl">Selected Software URL</Label>
                    <Input
                      id="selectedSoftwareUrl"
                      value={formData.selectedSoftwareUrl}
                      onChange={(e) => updateField('selectedSoftwareUrl', e.target.value)}
                      placeholder="https://demo.softwarevala.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Logo Upload (PNG/JPG)</Label>
                    <Input
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      onChange={(e) => handleFileUpload(e, 'logoFile')}
                    />
                    {formData.logoFile && (
                      <div className="flex items-center gap-2 p-2 bg-muted/30 rounded text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        {formData.logoFile.name}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 ml-auto"
                          onClick={() => updateField('logoFile', null)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referenceWebsiteUrl">Reference Website URL</Label>
                    <Input
                      id="referenceWebsiteUrl"
                      value={formData.referenceWebsiteUrl}
                      onChange={(e) => updateField('referenceWebsiteUrl', e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Additional Notes / Suggestions</Label>
                  <Textarea
                    id="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={(e) => updateField('additionalNotes', e.target.value)}
                    placeholder="Any additional notes or suggestions..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section D: File Upload */}
          {activeSection === 4 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Upload className="h-4 w-4 text-primary" />
                  Section D: File Upload
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Photo Upload */}
                <div className="space-y-2">
                  <Label>Photo Upload (PNG/JPG)</Label>
                  <Input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    multiple
                    onChange={(e) => handleFileUpload(e, 'photoFiles')}
                  />
                  {formData.photoFiles.length > 0 && (
                    <div className="space-y-1">
                      {formData.photoFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-muted/30 rounded text-sm">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          {file.name}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 ml-auto"
                            onClick={() => removeFile('photoFiles', idx)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Document Upload */}
                <div className="space-y-2">
                  <Label>Document Upload (PDF)</Label>
                  <Input
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={(e) => handleFileUpload(e, 'documentFiles')}
                  />
                  {formData.documentFiles.length > 0 && (
                    <div className="space-y-1">
                      {formData.documentFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-muted/30 rounded text-sm">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          {file.name}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 ml-auto"
                            onClick={() => removeFile('documentFiles', idx)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Other Files */}
                <div className="space-y-2">
                  <Label>Other Files (ZIP allowed)</Label>
                  <Input
                    type="file"
                    accept=".zip,.rar,.7z"
                    multiple
                    onChange={(e) => handleFileUpload(e, 'otherFiles')}
                  />
                  {formData.otherFiles.length > 0 && (
                    <div className="space-y-1">
                      {formData.otherFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-muted/30 rounded text-sm">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          {file.name}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 ml-auto"
                            onClick={() => removeFile('otherFiles', idx)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  All files will be linked to the generated PROJECT_ID
                </p>
              </CardContent>
            </Card>
          )}

          {/* Section E: Issues/Requirements */}
          {activeSection === 5 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  Section E: Issues / Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Issue Type</Label>
                    <Select 
                      value={formData.issueType} 
                      onValueChange={(v) => updateField('issueType', v as 'bug' | 'update' | 'new_feature')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select issue type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bug">Bug Fix</SelectItem>
                        <SelectItem value="update">Update / Modification</SelectItem>
                        <SelectItem value="new_feature">New Feature</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority Level</Label>
                    <Select 
                      value={formData.priorityLevel} 
                      onValueChange={(v) => updateField('priorityLevel', v as 'low' | 'medium' | 'high' | 'critical')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="expectedTimeline">Expected Timeline</Label>
                    <Input
                      id="expectedTimeline"
                      value={formData.expectedTimeline}
                      onChange={(e) => updateField('expectedTimeline', e.target.value)}
                      placeholder="e.g., 2 weeks, 1 month"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalComments">Additional Comments</Label>
                  <Textarea
                    id="additionalComments"
                    value={formData.additionalComments}
                    onChange={(e) => updateField('additionalComments', e.target.value)}
                    placeholder="Any additional requirements or comments..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation + Submit */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              {activeSection > 1 && (
                <Button 
                  variant="outline" 
                  onClick={() => setActiveSection(prev => prev - 1)}
                >
                  Previous
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {activeSection < 5 ? (
                <Button onClick={() => setActiveSection(prev => prev + 1)}>
                  Next Section
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Order'
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Submit Info */}
          <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border">
            <p className="text-xs text-muted-foreground">
              <strong>Submit Rule:</strong> On submission, a unique PROJECT_ID will be generated. 
              Status will be set to "Pending AI Approval". Notifications will be sent to VALA AI + Admin. 
              AI will analyze and provide approval/rejection with reason.
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
