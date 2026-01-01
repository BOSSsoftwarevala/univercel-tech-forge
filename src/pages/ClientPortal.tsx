import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Globe, Upload, FileText, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ClientProjectStatus from '@/components/client-portal/ClientProjectStatus';

const ClientPortal = () => {
  const [activeTab, setActiveTab] = useState('new-project');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    companyName: '',
    domainName: '',
    projectType: 'demo',
    requirements: '',
  });
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let logoUrl = null;
      
      // Upload logo if provided
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('logos')
          .upload(fileName, logoFile);
          
        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage
            .from('logos')
            .getPublicUrl(fileName);
          logoUrl = urlData.publicUrl;
        }
      }

      // Insert project request
      const { error } = await supabase.from('client_projects').insert({
        client_name: formData.clientName,
        client_email: formData.clientEmail,
        client_phone: formData.clientPhone,
        company_name: formData.companyName,
        domain_name: formData.domainName,
        project_type: formData.projectType,
        requirements: formData.requirements,
        logo_url: logoUrl,
        status: 'pending_review',
        status_message: 'Thank you for your request! Our development team is reviewing your requirements. We will contact you within 24-48 hours with a detailed quote.',
      });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: 'Request Submitted',
        description: 'Our team will review your requirements and get back to you shortly.',
      });
    } catch (error: any) {
      console.error('Submit error:', error);
      toast({
        title: 'Submission Failed',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Request Received!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your interest. Our development team is now reviewing your requirements. 
            We'll contact you at <strong>{formData.clientEmail}</strong> within 24-48 hours with a detailed quote.
          </p>
          <Button onClick={() => setActiveTab('check-status')}>
            Check Project Status
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Software Development Portal</h1>
              <p className="text-sm text-muted-foreground">Custom software solutions for your business</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="new-project">New Project</TabsTrigger>
            <TabsTrigger value="check-status">Check Status</TabsTrigger>
          </TabsList>

          <TabsContent value="new-project">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Start Your Project</CardTitle>
                  <CardDescription>
                    Tell us about your requirements and we'll get back to you with a custom quote
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="clientName">Your Name *</Label>
                          <Input
                            id="clientName"
                            name="clientName"
                            value={formData.clientName}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="clientEmail">Email *</Label>
                          <Input
                            id="clientEmail"
                            name="clientEmail"
                            type="email"
                            value={formData.clientEmail}
                            onChange={handleInputChange}
                            placeholder="john@company.com"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="clientPhone">Phone</Label>
                          <Input
                            id="clientPhone"
                            name="clientPhone"
                            value={formData.clientPhone}
                            onChange={handleInputChange}
                            placeholder="+91 98765 43210"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="companyName">Company Name</Label>
                          <Input
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            placeholder="Your Company Ltd."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Domain & Branding */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Domain & Branding
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="domainName">Your Domain Name *</Label>
                          <Input
                            id="domainName"
                            name="domainName"
                            value={formData.domainName}
                            onChange={handleInputChange}
                            placeholder="yourdomain.com"
                            required
                          />
                          <p className="text-xs text-muted-foreground">
                            We'll provide you an IP address to point your domain to
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="logo">Company Logo</Label>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <Input
                                id="logo"
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="cursor-pointer"
                              />
                            </div>
                            {logoPreview && (
                              <div className="w-16 h-16 border rounded-lg overflow-hidden">
                                <img 
                                  src={logoPreview} 
                                  alt="Logo preview" 
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Project Requirements
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="requirements">Describe your requirements *</Label>
                        <Textarea
                          id="requirements"
                          name="requirements"
                          value={formData.requirements}
                          onChange={handleInputChange}
                          placeholder="Please describe the type of software you need, key features, target users, and any specific requirements..."
                          rows={6}
                          required
                        />
                      </div>
                    </div>

                    {/* Submit */}
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        'Submitting...'
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Request
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Our team will review your requirements and contact you within 24-48 hours
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="check-status">
            <ClientProjectStatus />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ClientPortal;
