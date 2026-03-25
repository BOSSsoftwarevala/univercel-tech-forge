import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Store,
  ShoppingBag,
  Code,
  Star,
  Crown,
  Brain,
  Upload,
  Check,
  Users,
  Activity,
  Monitor,
  DollarSign,
  ChevronRight,
  Zap,
  Shield,
  Globe,
  FileCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { maskEmail, maskPhone } from "@/lib/masking";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { createSystemRequest } from "@/hooks/useSystemRequestLogger";

const applicationTypes = [
  {
    id: "franchise",
    title: "Franchise Application",
    description: "Own a territory and build your regional business empire with exclusive rights.",
    icon: Store,
    badge: "HOT",
    badgeColor: "bg-neon-orange text-primary-foreground",
    benefits: ["Exclusive Territory", "Commission Sharing", "Training Support"],
  },
  {
    id: "reseller",
    title: "Reseller Application",
    description: "Sell demos and earn commissions on every successful conversion.",
    icon: ShoppingBag,
    badge: "NEW",
    badgeColor: "bg-neon-green text-primary-foreground",
    benefits: ["Flexible Pricing", "Demo Access", "Marketing Kit"],
  },
  {
    id: "developer",
    title: "Developer Application",
    description: "Join elite developer pool and earn per task with guaranteed payments.",
    icon: Code,
    badge: "ACTIVE",
    badgeColor: "bg-primary text-primary-foreground",
    benefits: ["Fixed Rates", "Task Queue", "Skill Growth"],
  },
  {
    id: "influencer",
    title: "Influencer Application",
    description: "Promote Software Vala and earn through clicks, leads and conversions.",
    icon: Star,
    badge: null,
    badgeColor: "",
    benefits: ["CPC Earnings", "Unique Links", "Performance Bonus"],
  },
  {
    id: "prime",
    title: "Prime User Application",
    description: "Get priority support, dedicated developers and exclusive features.",
    icon: Crown,
    badge: "VIP",
    badgeColor: "bg-gold text-primary-foreground",
    benefits: ["Priority Queue", "Dedicated Support", "Exclusive Access"],
  },
];

const countries = [
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "AE", name: "UAE", flag: "🇦🇪" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "BI", name: "Burundi", flag: "🇧🇮" },
  { code: "LR", name: "Liberia", flag: "🇱🇷" },
  { code: "SS", name: "South Sudan", flag: "🇸🇸" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
];

// Masking functions imported at top of file from @/lib/masking

const ApplyPortal = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
  });
  const [idUploaded, setIdUploaded] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [promiseAcknowledged, setPromiseAcknowledged] = useState(false);
  const [showMasked, setShowMasked] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const liveStats = {
    leads: 1247,
    activeDevelopers: 89,
    availableDemos: 312,
    currentCommissions: 24680,
  };

  const handleSubmitApplication = async () => {
    if (!selectedType || !formData.fullName || !formData.email) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        // Store form data in sessionStorage and redirect to auth
        sessionStorage.setItem('pendingApplication', JSON.stringify({
          type: selectedType,
          formData,
          idUploaded,
          termsAccepted,
          promiseAcknowledged
        }));
        toast.info("Please login or signup to submit your application");
        navigate(`/auth?redirect=/apply&type=${selectedType}`);
        return;
      }

      // Submit application to database
      const { error } = await supabase
        .from('reseller_applications')
        .insert({
          user_id: session.user.id,
          application_type: selectedType,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone || null,
          country: formData.country || null,
          id_proof_uploaded: idUploaded,
          terms_accepted: termsAccepted,
          promise_acknowledged: promiseAcknowledged,
          status: 'pending'
        });

      if (error) {
        console.error("Application submission error:", error);
        toast.error("Failed to submit application. Please try again.");
        return;
      }

      // Log to system_events for Boss Panel visibility
      await createSystemRequest({
        action_type: selectedType,
        role_type: selectedType,
        status: 'PENDING',
        source: 'apply_portal',
        payload_json: {
          intent: 'application_submitted',
          application_type: selectedType,
          full_name: formData.fullName,
          country: formData.country,
          path: window.location.pathname,
        },
        user_id: session.user.id,
      });

      toast.success("Application submitted successfully! We'll review it shortly.");
      
      // Reset form
      setSelectedType(null);
      setFormData({ fullName: "", email: "", phone: "", country: "" });
      setIdUploaded(false);
      setTermsAccepted(false);
      setPromiseAcknowledged(false);

    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-graphite-dark via-background to-sapphire/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)/0.3) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary)/0.3) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/30"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0.3 
            }}
            animate={{
              y: [null, Math.random() * -200 - 100],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/30 bg-card/30 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-neon-purple flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Apply & Join Software Vala</h1>
              <div className="h-0.5 w-full bg-gradient-to-r from-primary via-neon-teal to-transparent mt-1" />
            </div>
          </div>
          
          {/* AI Assistant Icon */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-xl bg-card/60 border border-primary/30 flex items-center justify-center hover:border-primary/60 transition-all group"
          >
            <Brain className="w-6 h-6 text-primary group-hover:text-neon-cyan transition-colors" />
          </motion.button>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Application Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {applicationTypes.map((type, index) => (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
                  className={`
                    relative p-6 rounded-xl cursor-pointer transition-all duration-300
                    bg-card/60 backdrop-blur-xl border
                    ${selectedType === type.id 
                      ? "border-primary shadow-lg shadow-primary/20" 
                      : "border-border/30 hover:border-primary/50"}
                  `}
                >
                  {/* Neon glow effect on hover */}
                  <div className={`
                    absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300
                    ${selectedType === type.id ? "opacity-100" : "group-hover:opacity-50"}
                  `}
                    style={{
                      background: "radial-gradient(ellipse at center, hsl(var(--primary)/0.1), transparent 70%)"
                    }}
                  />

                  {/* Badge */}
                  {type.badge && (
                    <Badge className={`absolute top-4 right-4 ${type.badgeColor} text-xs font-semibold`}>
                      {type.badge}
                    </Badge>
                  )}

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-secondary/50 border border-primary/20 flex items-center justify-center mb-4">
                    <type.icon className="w-7 h-7 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-foreground mb-2 neon-text-subtle">
                    {type.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {type.description}
                  </p>

                  {/* Benefits */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {type.benefits.map((benefit) => (
                      <span 
                        key={benefit}
                        className="text-xs px-2 py-1 rounded-full bg-secondary/50 text-muted-foreground"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>

                  {/* Eligibility Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-primary/50 text-primary hover:bg-primary/10 hover:border-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Check Eligibility
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Application Form */}
            <AnimatePresence>
              {selectedType && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-8 rounded-xl bg-card/60 backdrop-blur-xl border border-border/30">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                      <FileCheck className="w-6 h-6 text-primary" />
                      <span className="neon-text-subtle">
                        {applicationTypes.find(t => t.id === selectedType)?.title}
                      </span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-muted-foreground">Full Name</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="Enter your full name"
                          className="bg-secondary/30 border-border/50 focus:border-primary"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-muted-foreground">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={showMasked && formData.email ? maskEmail(formData.email) : formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          onFocus={() => setShowMasked(false)}
                          onBlur={() => setShowMasked(true)}
                          placeholder="email@example.com"
                          className="bg-secondary/30 border-border/50 focus:border-primary"
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-muted-foreground">Phone Number</Label>
                        <Input
                          id="phone"
                          value={showMasked && formData.phone ? maskPhone(formData.phone) : formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          onFocus={() => setShowMasked(false)}
                          onBlur={() => setShowMasked(true)}
                          placeholder="+91 98765 43210"
                          className="bg-secondary/30 border-border/50 focus:border-primary"
                        />
                      </div>

                      {/* Country Selector */}
                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-muted-foreground">Country</Label>
                        <Select
                          value={formData.country}
                          onValueChange={(value) => setFormData({ ...formData, country: value })}
                        >
                          <SelectTrigger className="bg-secondary/30 border-border/50 focus:border-primary">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            {countries.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                <span className="flex items-center gap-2">
                                  <span className="text-lg">{country.flag}</span>
                                  <span>{country.name}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* ID Upload */}
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-muted-foreground">ID Proof Document</Label>
                        <div className="flex gap-4 items-center">
                          <Button
                            variant="outline"
                            className={`
                              border-primary/50 hover:bg-primary/10
                              ${idUploaded ? "border-neon-green text-neon-green" : "text-primary"}
                            `}
                            onClick={() => setIdUploaded(true)}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {idUploaded ? "Document Uploaded" : "Upload ID Proof"}
                          </Button>
                          {idUploaded && (
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="text-sm text-muted-foreground flex items-center gap-2"
                            >
                              <Check className="w-4 h-4 text-neon-green" />
                              ID_****_masked.pdf
                            </motion.span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Terms & Agreements */}
                    <div className="mt-8 pt-6 border-t border-border/30 space-y-4">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="terms"
                          checked={termsAccepted}
                          onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                          className="border-primary/50 data-[state=checked]:bg-primary"
                        />
                        <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                          I agree to the Terms of Service and Privacy Policy
                        </Label>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/30">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-primary" />
                          <span className="text-sm text-muted-foreground">
                            I acknowledge the Software Vala Promise System
                          </span>
                        </div>
                        <Switch
                          checked={promiseAcknowledged}
                          onCheckedChange={setPromiseAcknowledged}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6">
                      <Button
                        className="w-full bg-neon-green hover:bg-neon-green/90 text-primary-foreground font-semibold py-6"
                        disabled={!termsAccepted || !promiseAcknowledged || !formData.fullName || !formData.email || isSubmitting}
                        onClick={handleSubmitApplication}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Check className="w-5 h-5 mr-2" />
                            Submit Application
                            <ChevronRight className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                No advance. Fixed pricing. Lifetime updates.
              </p>
            </div>
          </div>

          {/* Right Side Panel - Live Stats */}
          <div className="hidden xl:block w-80">
            <div className="sticky top-8 space-y-6">
              {/* Live Stats Widget */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 rounded-xl bg-card/60 backdrop-blur-xl border border-border/30"
              >
                <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  LIVE STATS
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-neon-cyan" />
                      <span className="text-sm text-muted-foreground">Active Leads</span>
                    </div>
                    <span className="text-lg font-bold text-foreground font-mono">
                      {liveStats.leads.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <Code className="w-5 h-5 text-neon-purple" />
                      <span className="text-sm text-muted-foreground">Developers</span>
                    </div>
                    <span className="text-lg font-bold text-foreground font-mono">
                      {liveStats.activeDevelopers}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <Monitor className="w-5 h-5 text-neon-teal" />
                      <span className="text-sm text-muted-foreground">Demos</span>
                    </div>
                    <span className="text-lg font-bold text-foreground font-mono">
                      {liveStats.availableDemos}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-neon-green/10 to-transparent border border-neon-green/20">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-neon-green" />
                      <span className="text-sm text-muted-foreground">Commissions</span>
                    </div>
                    <span className="text-lg font-bold text-neon-green font-mono">
                      ${liveStats.currentCommissions.toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* AI Hint Tooltip */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-xl bg-card/60 backdrop-blur-xl border border-primary/20"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary mb-1">AI Tip</p>
                    <p className="text-xs text-muted-foreground">
                      Click "Check Eligibility" on any card to get AI-powered recommendations based on your profile.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for subtle neon text */}
      <style>{`
        .neon-text-subtle {
          text-shadow: 0 0 10px hsl(var(--primary) / 0.3),
                       0 0 20px hsl(var(--primary) / 0.1);
        }
      `}</style>
    </div>
  );
};

export default ApplyPortal;
