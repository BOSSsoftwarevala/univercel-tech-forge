import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Upload, CreditCard, Code, Briefcase, 
  CheckCircle, Clock, XCircle, AlertTriangle, Shield,
  ChevronRight, ChevronLeft, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import DashboardLayout from '@/components/layouts/DashboardLayout';

const SKILLS_OPTIONS = [
  'React', 'Vue', 'Angular', 'Next.js', 'Node.js', 'Python', 'Java', 'Go', 
  'TypeScript', 'JavaScript', 'PHP', 'Ruby', 'Rust', 'C++', 'C#', '.NET',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure'
];

const STEPS = [
  { id: 'rules', title: 'Rules & NDA', icon: Shield },
  { id: 'documents', title: 'Documents', icon: Upload },
  { id: 'bank', title: 'Bank Details', icon: CreditCard },
  { id: 'skills', title: 'Skills', icon: Code },
  { id: 'projects', title: 'Past Projects', icon: Briefcase },
  { id: 'review', title: 'Review & Submit', icon: CheckCircle }
];

interface Registration {
  id: string;
  status: string;
  full_name: string;
  email: string;
  phone: string;
  nda_accepted: boolean;
  rules_accepted: boolean;
  resume_url: string | null;
  photo_id_url: string | null;
  bank_name: string | null;
  account_holder_name: string | null;
  account_number_masked: string | null;
  ifsc_code: string | null;
  primary_skills: string[];
  programming_languages: string[];
  frameworks: string[];
  years_of_experience: number;
  expertise_level: string;
  rejection_reason: string | null;
}

interface PastProject {
  id?: string;
  project_name: string;
  project_description: string;
  project_url: string;
  technologies_used: string[];
  role_in_project: string;
  duration_months: number;
}

const DeveloperRegistration = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [pastProjects, setPastProjects] = useState<PastProject[]>([]);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingPhotoId, setUploadingPhotoId] = useState(false);

  useEffect(() => {
    if (user) fetchRegistration();
  }, [user]);

  const fetchRegistration = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('developer_registrations')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (data) {
      setRegistration(data as unknown as Registration);
      
      // Fetch past projects
      const { data: projects } = await supabase
        .from('developer_past_projects')
        .select('*')
        .eq('user_id', user.id);
      
      if (projects) setPastProjects(projects as unknown as PastProject[]);
    } else if (!error || error.code === 'PGRST116') {
      // Create new registration
      const { data: newReg, error: createError } = await supabase
        .from('developer_registrations')
        .insert({
          user_id: user.id,
          full_name: user.user_metadata?.full_name || '',
          email: user.email || '',
          status: 'pending_documents'
        })
        .select()
        .single();
      
      if (newReg) setRegistration(newReg as unknown as Registration);
      if (createError) toast.error('Failed to create registration');
    }
    
    setLoading(false);
  };

  const updateRegistration = async (updates: Record<string, any>) => {
    if (!registration) return;
    setSaving(true);
    
    const { error } = await supabase
      .from('developer_registrations')
      .update({ ...updates, updated_at: new Date().toISOString() } as any)
      .eq('id', registration.id);
    
    if (error) {
      toast.error('Failed to save');
    } else {
      setRegistration({ ...registration, ...updates } as Registration);
      toast.success('Saved');
    }
    setSaving(false);
  };

  const uploadFile = async (file: File, type: 'resume' | 'photo_id') => {
    if (!user || !registration) return;
    
    const setUploading = type === 'resume' ? setUploadingResume : setUploadingPhotoId;
    setUploading(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${type}_${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('developer-documents')
      .upload(fileName, file);
    
    if (uploadError) {
      toast.error('Upload failed: ' + uploadError.message);
      setUploading(false);
      return;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('developer-documents')
      .getPublicUrl(fileName);
    
    const updateField = type === 'resume' 
      ? { resume_url: publicUrl, resume_uploaded_at: new Date().toISOString() }
      : { photo_id_url: publicUrl, photo_id_uploaded_at: new Date().toISOString() };
    
    await updateRegistration(updateField as any);
    setUploading(false);
    toast.success(`${type === 'resume' ? 'Resume' : 'Photo ID'} uploaded`);
  };

  const addPastProject = async (project: PastProject) => {
    if (!user || !registration) return;
    
    const { data, error } = await supabase
      .from('developer_past_projects')
      .insert({
        registration_id: registration.id,
        user_id: user.id,
        ...project
      })
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to add project');
    } else {
      setPastProjects([...pastProjects, data as unknown as PastProject]);
      toast.success('Project added');
    }
  };

  const submitRegistration = async () => {
    if (!registration) return;
    setSaving(true);
    
    const { data, error } = await supabase.rpc('submit_developer_registration', {
      p_registration_id: registration.id
    });
    
    const result = data as unknown as { success: boolean; error?: string };
    
    if (error || !result.success) {
      toast.error(result?.error || error?.message || 'Submission failed');
    } else {
      toast.success('Registration submitted for review!');
      setRegistration({ ...registration, status: 'submitted' });
    }
    setSaving(false);
  };

  const getStatusBadge = () => {
    const status = registration?.status || 'pending_documents';
    const configs: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
      pending_documents: { color: 'bg-yellow-500/20 text-yellow-400', icon: <Clock className="w-3 h-3" />, label: 'Pending Documents' },
      submitted: { color: 'bg-blue-500/20 text-blue-400', icon: <Clock className="w-3 h-3" />, label: 'Submitted' },
      under_review: { color: 'bg-purple-500/20 text-purple-400', icon: <AlertTriangle className="w-3 h-3" />, label: 'Under Review' },
      verified: { color: 'bg-green-500/20 text-green-400', icon: <CheckCircle className="w-3 h-3" />, label: 'Verified' },
      rejected: { color: 'bg-red-500/20 text-red-400', icon: <XCircle className="w-3 h-3" />, label: 'Rejected' }
    };
    const config = configs[status];
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        {config.icon} {config.label}
      </Badge>
    );
  };

  const progress = Math.round(((currentStep + 1) / STEPS.length) * 100);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
        </div>
      </DashboardLayout>
    );
  }

  // Show status if already submitted
  if (registration?.status && ['submitted', 'under_review', 'verified', 'rejected'].includes(registration.status)) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto p-6">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                {registration.status === 'verified' ? (
                  <CheckCircle className="w-16 h-16 text-green-400" />
                ) : registration.status === 'rejected' ? (
                  <XCircle className="w-16 h-16 text-red-400" />
                ) : (
                  <Clock className="w-16 h-16 text-blue-400 animate-pulse" />
                )}
              </div>
              <CardTitle className="text-2xl">
                {registration.status === 'verified' 
                  ? 'You are Verified!' 
                  : registration.status === 'rejected'
                  ? 'Registration Rejected'
                  : 'Registration Under Review'}
              </CardTitle>
              <CardDescription className="mt-2">
                {registration.status === 'verified' 
                  ? 'You now have full access to tasks and projects.'
                  : registration.status === 'rejected'
                  ? registration.rejection_reason || 'Please contact support for more information.'
                  : 'Your documents are being reviewed. This usually takes 24-48 hours.'}
              </CardDescription>
              {getStatusBadge()}
            </CardHeader>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Developer Registration</h1>
            <p className="text-slate-400">Complete verification to access tasks</p>
          </div>
          {getStatusBadge()}
        </div>

        {/* Progress */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Progress</span>
              <span className="text-sm font-medium text-cyan-400">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            
            {/* Step indicators */}
            <div className="flex justify-between mt-4">
              {STEPS.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(idx)}
                  className={`flex flex-col items-center gap-1 transition-all ${
                    idx === currentStep 
                      ? 'text-cyan-400' 
                      : idx < currentStep 
                      ? 'text-green-400' 
                      : 'text-slate-500'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    idx === currentStep 
                      ? 'border-cyan-400 bg-cyan-400/20' 
                      : idx < currentStep 
                      ? 'border-green-400 bg-green-400/20' 
                      : 'border-slate-600'
                  }`}>
                    <step.icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs hidden md:block">{step.title}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {React.createElement(STEPS[currentStep].icon, { className: 'w-5 h-5 text-cyan-400' })}
                  {STEPS[currentStep].title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 0: Rules & NDA */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <h3 className="font-semibold text-white mb-3">Platform Rules</h3>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li>• All work must be original and plagiarism-free</li>
                        <li>• Meet deadlines or face penalties</li>
                        <li>• Maintain confidentiality of client data</li>
                        <li>• No sharing of login credentials</li>
                        <li>• Quality standards must be maintained</li>
                        <li>• Regular communication is mandatory</li>
                      </ul>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Checkbox 
                        id="rules"
                        checked={registration?.rules_accepted || false}
                        onCheckedChange={(checked) => updateRegistration({ 
                          rules_accepted: !!checked,
                          rules_accepted_at: checked ? new Date().toISOString() : null
                        } as any)}
                      />
                      <Label htmlFor="rules" className="text-sm cursor-pointer">
                        I have read and agree to the platform rules
                      </Label>
                    </div>

                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <h3 className="font-semibold text-white mb-3">Non-Disclosure Agreement (NDA)</h3>
                      <p className="text-sm text-slate-300 mb-4">
                        By accepting, you agree to maintain strict confidentiality regarding all 
                        proprietary information, client data, and internal processes you encounter 
                        during your engagement with this platform.
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Checkbox 
                        id="nda"
                        checked={registration?.nda_accepted || false}
                        onCheckedChange={(checked) => updateRegistration({ 
                          nda_accepted: !!checked,
                          nda_accepted_at: checked ? new Date().toISOString() : null
                        } as any)}
                      />
                      <Label htmlFor="nda" className="text-sm cursor-pointer">
                        I accept the NDA terms and conditions
                      </Label>
                    </div>
                  </div>
                )}

                {/* Step 1: Documents */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <Label>Resume / CV</Label>
                      <div className="mt-2 border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                        {registration?.resume_url ? (
                          <div className="flex items-center justify-center gap-2 text-green-400">
                            <CheckCircle className="w-5 h-5" />
                            <span>Resume uploaded</span>
                          </div>
                        ) : (
                          <div>
                            <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                            <p className="text-sm text-slate-400">PDF, DOC, DOCX (Max 5MB)</p>
                          </div>
                        )}
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], 'resume')}
                          className="hidden"
                          id="resume-upload"
                          disabled={uploadingResume}
                        />
                        <Button
                          variant="outline"
                          className="mt-3"
                          onClick={() => document.getElementById('resume-upload')?.click()}
                          disabled={uploadingResume}
                        >
                          {uploadingResume ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                          {registration?.resume_url ? 'Replace Resume' : 'Upload Resume'}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Photo ID (Government Issued)</Label>
                      <div className="mt-2 border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                        {registration?.photo_id_url ? (
                          <div className="flex items-center justify-center gap-2 text-green-400">
                            <CheckCircle className="w-5 h-5" />
                            <span>Photo ID uploaded</span>
                          </div>
                        ) : (
                          <div>
                            <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                            <p className="text-sm text-slate-400">JPG, PNG, PDF (Max 5MB)</p>
                          </div>
                        )}
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], 'photo_id')}
                          className="hidden"
                          id="photo-id-upload"
                          disabled={uploadingPhotoId}
                        />
                        <Button
                          variant="outline"
                          className="mt-3"
                          onClick={() => document.getElementById('photo-id-upload')?.click()}
                          disabled={uploadingPhotoId}
                        >
                          {uploadingPhotoId ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                          {registration?.photo_id_url ? 'Replace Photo ID' : 'Upload Photo ID'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Bank Details */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <p className="text-sm text-yellow-400">
                        Bank details are securely stored and only used for payment processing.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Bank Name</Label>
                        <Input
                          value={registration?.bank_name || ''}
                          onChange={(e) => updateRegistration({ bank_name: e.target.value } as any)}
                          placeholder="e.g. State Bank of India"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Account Holder Name</Label>
                        <Input
                          value={registration?.account_holder_name || ''}
                          onChange={(e) => updateRegistration({ account_holder_name: e.target.value } as any)}
                          placeholder="As per bank records"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Account Number</Label>
                        <Input
                          type="password"
                          value={registration?.account_number_masked || ''}
                          onChange={(e) => updateRegistration({ account_number_masked: e.target.value } as any)}
                          placeholder="••••••••••"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>IFSC Code</Label>
                        <Input
                          value={registration?.ifsc_code || ''}
                          onChange={(e) => updateRegistration({ ifsc_code: e.target.value.toUpperCase() } as any)}
                          placeholder="e.g. SBIN0001234"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Skills */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <Label>Years of Experience</Label>
                      <Select
                        value={String(registration?.years_of_experience || 0)}
                        onValueChange={(v) => updateRegistration({ years_of_experience: parseInt(v) } as any)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((y) => (
                            <SelectItem key={y} value={String(y)}>
                              {y === 0 ? 'Less than 1 year' : y === 10 ? '10+ years' : `${y} years`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Expertise Level</Label>
                      <Select
                        value={registration?.expertise_level || 'junior'}
                        onValueChange={(v) => updateRegistration({ expertise_level: v } as any)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="junior">Junior Developer</SelectItem>
                          <SelectItem value="mid">Mid-Level Developer</SelectItem>
                          <SelectItem value="senior">Senior Developer</SelectItem>
                          <SelectItem value="lead">Tech Lead / Architect</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Primary Skills (Select all that apply)</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {SKILLS_OPTIONS.map((skill) => (
                          <Badge
                            key={skill}
                            variant={registration?.primary_skills?.includes(skill) ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => {
                              const current = registration?.primary_skills || [];
                              const updated = current.includes(skill)
                                ? current.filter(s => s !== skill)
                                : [...current, skill];
                              updateRegistration({ primary_skills: updated } as any);
                            }}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Past Projects */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    {pastProjects.map((project, idx) => (
                      <div key={idx} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                        <h4 className="font-medium text-white">{project.project_name}</h4>
                        <p className="text-sm text-slate-400 mt-1">{project.project_description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.technologies_used.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="p-4 border-2 border-dashed border-slate-600 rounded-lg space-y-4">
                      <h4 className="font-medium text-white">Add Project</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Project Name" id="proj-name" />
                        <Input placeholder="Your Role" id="proj-role" />
                      </div>
                      <Textarea placeholder="Brief description..." id="proj-desc" />
                      <Input placeholder="Live URL or GitHub link (optional)" id="proj-url" />
                      <Button
                        variant="outline"
                        onClick={() => {
                          const name = (document.getElementById('proj-name') as HTMLInputElement)?.value;
                          const role = (document.getElementById('proj-role') as HTMLInputElement)?.value;
                          const desc = (document.getElementById('proj-desc') as HTMLTextAreaElement)?.value;
                          const url = (document.getElementById('proj-url') as HTMLInputElement)?.value;
                          
                          if (name && role) {
                            addPastProject({
                              project_name: name,
                              role_in_project: role,
                              project_description: desc,
                              project_url: url,
                              technologies_used: registration?.primary_skills || [],
                              duration_months: 0
                            });
                          }
                        }}
                      >
                        Add Project
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 5: Review & Submit */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <span className="text-slate-400">Rules Accepted</span>
                        {registration?.rules_accepted ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <span className="text-slate-400">NDA Accepted</span>
                        {registration?.nda_accepted ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <span className="text-slate-400">Resume Uploaded</span>
                        {registration?.resume_url ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <span className="text-slate-400">Photo ID Uploaded</span>
                        {registration?.photo_id_url ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <span className="text-slate-400">Bank Details</span>
                        {registration?.bank_name && registration?.account_number_masked ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <span className="text-slate-400">Skills Selected</span>
                        {registration?.primary_skills && registration.primary_skills.length > 0 ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600"
                      size="lg"
                      onClick={submitRegistration}
                      disabled={saving}
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Submit for Verification
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
            disabled={currentStep === STEPS.length - 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DeveloperRegistration;
