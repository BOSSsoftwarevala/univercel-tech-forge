import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { 
  Code2, Megaphone, Briefcase, Users, Star, CheckCircle2,
  ArrowRight, Sparkles, Zap, Shield, Heart, Globe,
  Rocket, Award, Clock, DollarSign, Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { logCriticalActivity } from "@/hooks/useActivityLogger";
import softwareValaLogo from "@/assets/software-vala-logo.jpg";

type PortalType = "developer" | "influencer" | "job";

interface RoleInfo {
  type: PortalType;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  benefits: string[];
  welcomeMessage: string;
}

const roleInfoMap: Record<PortalType, RoleInfo> = {
  developer: {
    type: "developer",
    title: "Join as Developer",
    subtitle: "Build the Future with Us",
    icon: Code2,
    color: "from-violet-600 to-purple-600",
    benefits: [
      "Work on cutting-edge projects",
      "Flexible remote work options",
      "Competitive pay + bonuses",
      "Learn & grow with expert team",
      "Direct client interaction",
      "Equity opportunities"
    ],
    welcomeMessage: "Welcome to the Software Vala Developer Community! 🚀 We're building the future of business software together. Join 500+ talented developers who chose excellence."
  },
  influencer: {
    type: "influencer",
    title: "Become an Influencer",
    subtitle: "Earn While You Share",
    icon: Megaphone,
    color: "from-pink-600 to-rose-600",
    benefits: [
      "Earn up to 30% commission",
      "Exclusive promo codes",
      "Free software access",
      "Marketing materials provided",
      "Dedicated support team",
      "Monthly bonus programs"
    ],
    welcomeMessage: "Welcome to the Software Vala Influencer Program! 💫 Turn your audience into income. Join 200+ successful influencers earning ₹50K-₹5L monthly!"
  },
  job: {
    type: "job",
    title: "Apply for a Job",
    subtitle: "Shape Your Career",
    icon: Briefcase,
    color: "from-cyan-600 to-blue-600",
    benefits: [
      "Competitive salary packages",
      "Health insurance coverage",
      "Performance bonuses",
      "Career growth path",
      "Training & certifications",
      "Work-life balance"
    ],
    welcomeMessage: "Welcome to Software Vala Careers! 🌟 We're always looking for exceptional talent. Join a company that values innovation, integrity, and impact."
  }
};

const CareerPortal = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const typeParam = searchParams.get("type") as PortalType | null;
  const [selectedType, setSelectedType] = useState<PortalType | null>(typeParam);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    portfolio: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Save to job_applications table
      const { error: insertError } = await (supabase as any).from('job_applications').insert({
        application_type: selectedType || 'job',
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        experience: formData.experience || null,
        portfolio: formData.portfolio || null,
        message: formData.message || null,
        status: 'pending',
        user_agent: navigator.userAgent,
      });

      if (insertError) throw insertError;

      // 2. Log to activity_log for Boss Panel tracking
      await logCriticalActivity({
        actionType: selectedType === 'job' ? 'job_apply' : selectedType === 'developer' ? 'franchise_apply' : 'influencer_join',
        entityType: 'job_application',
        severity: 'info',
        metadata: {
          name: formData.name,
          email: formData.email,
          application_type: selectedType,
          source: 'career_portal',
        },
      });

      // 3. Insert into system_events for real-time Boss Panel notification
      await (supabase as any).from('system_events').insert({
        event_type: selectedType === 'job' ? 'job_apply' : selectedType === 'developer' ? 'developer_request' : 'influencer_join',
        source_role: 'public',
        payload: {
          request_label: `${selectedType?.toUpperCase()} Application: ${formData.name}`,
          name: formData.name,
          email: formData.email,
          application_type: selectedType,
        },
        status: 'PENDING',
      });

      toast({
        title: "🎉 Application Submitted!",
        description: "We'll review your application and get back to you within 48 hours.",
      });

      setFormData({ name: "", email: "", phone: "", experience: "", portfolio: "", message: "" });
    } catch (err) {
      console.error('Application submission error:', err);
      toast({
        title: "Submission Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleInfo = selectedType ? roleInfoMap[selectedType] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-xl border-b border-white/10 py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={softwareValaLogo} alt="Software Vala" className="h-12 w-12 rounded-full object-cover border-2 border-white/20" />
            <div>
              <h1 className="text-white font-bold text-xl">Software Vala</h1>
              <p className="text-white/60 text-xs">Career Portal</p>
            </div>
          </Link>
          <Link to="/">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {!selectedType ? (
          <>
            {/* Welcome Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-500/30 mb-4">
                <Sparkles className="w-3 h-3 mr-1" />
                Join Our Growing Team
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Path</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Whether you're a developer, influencer, or looking for a career opportunity, 
                we have something special for you.
              </p>
            </motion.div>

            {/* Role Selection Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {Object.values(roleInfoMap).map((role, index) => (
                <motion.div
                  key={role.type}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-to-br ${role.color} border-0 p-6 h-full`}
                    onClick={() => setSelectedType(role.type)}
                  >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    <div className="relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                        <role.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-2">{role.title}</h3>
                      <p className="text-white/80 mb-6">{role.subtitle}</p>
                      
                      <ul className="space-y-2 mb-6">
                        {role.benefits.slice(0, 4).map((benefit, i) => (
                          <li key={i} className="flex items-center gap-2 text-white/90 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-white/70" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                      
                      <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0">
                        Get Started <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Stats Section */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {[
                { label: "Team Members", value: "500+", icon: Users },
                { label: "Projects Delivered", value: "2000+", icon: Rocket },
                { label: "Countries", value: "15+", icon: Globe },
                { label: "Client Rating", value: "4.9★", icon: Star },
              ].map((stat, i) => (
                <Card key={i} className="bg-white/5 border-white/10 p-6 text-center">
                  <stat.icon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </Card>
              ))}
            </motion.div>
          </>
        ) : roleInfo && (
          <>
            {/* Back Button */}
            <Button 
              variant="ghost" 
              className="text-white/60 mb-6"
              onClick={() => setSelectedType(null)}
            >
              ← Back to Options
            </Button>

            {/* Welcome Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl bg-gradient-to-r ${roleInfo.color} p-8 mb-8`}
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                  <roleInfo.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{roleInfo.title}</h2>
                  <p className="text-white/90 text-lg">{roleInfo.welcomeMessage}</p>
                </div>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-white/5 border-white/10 p-6 h-full">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    What You'll Get
                  </h3>
                  <ul className="space-y-4">
                    {roleInfo.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-300">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${roleInfo.color} flex items-center justify-center`}>
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>

              {/* Application Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-white/5 border-white/10 p-6">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    Apply Now
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Full Name *</Label>
                      <Input 
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your full name"
                        className="bg-white/5 border-white/20 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Email *</Label>
                      <Input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your@email.com"
                        className="bg-white/5 border-white/20 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Phone *</Label>
                      <Input 
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+91 XXXXX XXXXX"
                        className="bg-white/5 border-white/20 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Experience</Label>
                      <Input 
                        value={formData.experience}
                        onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                        placeholder="e.g., 3 years in React development"
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Portfolio / Social Link</Label>
                      <Input 
                        value={formData.portfolio}
                        onChange={(e) => setFormData(prev => ({ ...prev, portfolio: e.target.value }))}
                        placeholder="https://..."
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Tell us about yourself</Label>
                      <Textarea 
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Why do you want to join us?"
                        className="bg-white/5 border-white/20 text-white min-h-[100px]"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className={`w-full bg-gradient-to-r ${roleInfo.color} hover:opacity-90`}
                    >
                      {isSubmitting ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </form>
                </Card>
              </motion.div>
            </div>
          </>
        )}
      </div>

      {/* Security Footer */}
      <footer className="bg-black/50 border-t border-white/10 py-6 px-4 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-6 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              256-bit SSL Encryption
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-400" />
              Made with love in India
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-4">
            © 2024 Software Vala. All rights reserved. Your data is safe with us.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CareerPortal;