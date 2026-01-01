import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Upload, FileText, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ClientProjectStatus from '@/components/client-portal/ClientProjectStatus';
import softwareValaLogo from '@/assets/software-vala-logo.jpg';

const ClientPortal = () => {
  const [activeTab, setActiveTab] = useState('new-project');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    companyName: '',
    domainName: '',
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

      const { error } = await supabase.from('client_projects').insert({
        client_name: formData.clientName,
        client_email: formData.clientEmail,
        client_phone: formData.clientPhone,
        company_name: formData.companyName,
        domain_name: formData.domainName,
        project_type: 'custom',
        requirements: formData.requirements,
        logo_url: logoUrl,
        status: 'pending_review',
        status_message: 'Thank you! Our developers are reviewing your project. We will contact you within 24-48 hours.',
      });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: 'Request Submitted',
        description: 'Our team will review and get back to you shortly.',
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
            Our developers are reviewing your requirements. We'll contact you at <strong>{formData.clientEmail}</strong> within 24-48 hours.
          </p>
          <Button onClick={() => { setSubmitted(false); setActiveTab('check-status'); }}>
            Check Status
          </Button>
          <p className="text-xs text-muted-foreground mt-8">Powered by Software Vala</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={softwareValaLogo} alt="Software Vala" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h1 className="text-lg font-bold">Software Vala</h1>
                <p className="text-xs text-muted-foreground">Custom Software Development</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-xs grid-cols-2 mb-6">
            <TabsTrigger value="new-project">New Project</TabsTrigger>
            <TabsTrigger value="check-status">Check Status</TabsTrigger>
          </TabsList>

          <TabsContent value="new-project">
            <div className="max-w-lg mx-auto">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Start Your Project</CardTitle>
                  <CardDescription>Tell us what you need</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="clientName">Name *</Label>
                        <Input
                          id="clientName"
                          name="clientName"
                          value={formData.clientName}
                          onChange={handleInputChange}
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="clientEmail">Email *</Label>
                        <Input
                          id="clientEmail"
                          name="clientEmail"
                          type="email"
                          value={formData.clientEmail}
                          onChange={handleInputChange}
                          placeholder="you@email.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Phone & Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="clientPhone">Phone</Label>
                        <Input
                          id="clientPhone"
                          name="clientPhone"
                          value={formData.clientPhone}
                          onChange={handleInputChange}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="companyName">Company</Label>
                        <Input
                          id="companyName"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          placeholder="Your company"
                        />
                      </div>
                    </div>

                    {/* Domain */}
                    <div className="space-y-1">
                      <Label htmlFor="domainName" className="flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Domain *
                      </Label>
                      <Input
                        id="domainName"
                        name="domainName"
                        value={formData.domainName}
                        onChange={handleInputChange}
                        placeholder="yourdomain.com"
                        required
                      />
                      <p className="text-[10px] text-muted-foreground">
                        We'll provide an IP address to point your domain
                      </p>
                    </div>
                    
                    {/* Logo */}
                    <div className="space-y-1">
                      <Label htmlFor="logo" className="flex items-center gap-1">
                        <Upload className="w-3 h-3" /> Logo
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="logo"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="cursor-pointer text-sm"
                        />
                        {logoPreview && (
                          <div className="w-10 h-10 border rounded overflow-hidden shrink-0">
                            <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="space-y-1">
                      <Label htmlFor="requirements" className="flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Requirements *
                      </Label>
                      <Textarea
                        id="requirements"
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleInputChange}
                        placeholder="Describe your software requirements..."
                        rows={4}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Request
                        </>
                      )}
                    </Button>
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

      {/* Footer */}
      <footer className="border-t py-4 mt-auto">
        <p className="text-center text-xs text-muted-foreground">
          Powered by <span className="font-medium">Software Vala</span>
        </p>
      </footer>
    </div>
  );
};

export default ClientPortal;
