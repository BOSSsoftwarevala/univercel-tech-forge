/**
 * Trial to Live Purchase Modal
 * Direct buy flow for converting User Trial to Live System
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard, Check, Zap, Building2, Users, Calendar,
  Shield, Lock, Sparkles, ArrowRight, CheckCircle2,
  Package, Star, Crown, Gift, BadgeCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

interface TrialPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  onPurchaseComplete?: () => void;
}

// Pricing plans
const PRICING_PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "₹49,999",
    priceValue: 49999,
    period: "/year",
    description: "Perfect for small schools",
    features: [
      "Up to 500 students",
      "5 staff accounts",
      "Basic modules",
      "Email support",
      "1 branch"
    ],
    popular: false,
    icon: Package
  },
  {
    id: "professional",
    name: "Professional",
    price: "₹99,999",
    priceValue: 99999,
    period: "/year",
    description: "Best for growing institutions",
    features: [
      "Up to 2000 students",
      "25 staff accounts",
      "All modules included",
      "Priority support",
      "3 branches",
      "Custom reports",
      "API access"
    ],
    popular: true,
    icon: Star
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "₹1,85,000",
    priceValue: 185000,
    period: "/year",
    description: "Complete solution for large schools",
    features: [
      "Unlimited students",
      "Unlimited staff",
      "All modules + Custom",
      "24/7 dedicated support",
      "Unlimited branches",
      "White-label option",
      "On-premise deployment",
      "Custom integrations"
    ],
    popular: false,
    icon: Crown
  }
];

const TrialPurchaseModal = ({ 
  isOpen, 
  onClose, 
  productName = "School Management System",
  onPurchaseComplete 
}: TrialPurchaseModalProps) => {
  const [step, setStep] = useState<"plan" | "billing" | "payment" | "success">("plan");
  const [selectedPlan, setSelectedPlan] = useState("professional");
  const [billingInfo, setBillingInfo] = useState({
    schoolName: "",
    email: "",
    phone: "",
    address: "",
    gstNumber: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleBillingSubmit = () => {
    if (!billingInfo.schoolName || !billingInfo.email || !billingInfo.phone) {
      toast.error("Please fill all required fields");
      return;
    }
    setStep("payment");
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setStep("success");
    
    toast.success("Payment Successful!", {
      description: "Your system is being activated..."
    });
  };

  const handleComplete = () => {
    onPurchaseComplete?.();
    onClose();
    setStep("plan");
    
    toast.success("🎉 System Activated!", {
      description: "Your School Management System is now LIVE. All trial data has been preserved.",
      duration: 5000
    });
  };

  const selectedPlanDetails = PRICING_PLANS.find(p => p.id === selectedPlan);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Zap className="w-6 h-6 text-amber-500" />
            {step === "success" ? "Purchase Complete!" : "Buy & Go Live"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {step === "plan" && "Choose your plan and convert your trial to a live system instantly"}
            {step === "billing" && "Enter your billing information"}
            {step === "payment" && "Complete your payment to activate"}
            {step === "success" && "Your system is now live!"}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 py-4">
          {["plan", "billing", "payment", "success"].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s ? "bg-amber-500 text-white" :
                ["plan", "billing", "payment", "success"].indexOf(step) > i 
                  ? "bg-green-500 text-white" 
                  : "bg-slate-700 text-slate-400"
              }`}>
                {["plan", "billing", "payment", "success"].indexOf(step) > i 
                  ? <Check className="w-4 h-4" /> 
                  : i + 1}
              </div>
              {i < 3 && (
                <div className={`w-12 h-1 mx-1 ${
                  ["plan", "billing", "payment", "success"].indexOf(step) > i 
                    ? "bg-green-500" 
                    : "bg-slate-700"
                }`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Plan Selection */}
          {step === "plan" && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PRICING_PLANS.map((plan) => (
                  <Card
                    key={plan.id}
                    onClick={() => handlePlanSelect(plan.id)}
                    className={`cursor-pointer transition-all ${
                      selectedPlan === plan.id
                        ? "bg-amber-500/20 border-amber-500"
                        : "bg-slate-800 border-slate-700 hover:border-slate-600"
                    } ${plan.popular ? "ring-2 ring-amber-500/50" : ""}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-amber-500 text-white">Most Popular</Badge>
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <plan.icon className={`w-5 h-5 ${
                          selectedPlan === plan.id ? "text-amber-400" : "text-slate-400"
                        }`} />
                        <CardTitle className="text-white text-lg">{plan.name}</CardTitle>
                      </div>
                      <CardDescription className="text-slate-400">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-white">{plan.price}</span>
                        <span className="text-slate-400">{plan.period}</span>
                      </div>
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Shield className="w-4 h-4" />
                  <span>30-day money-back guarantee</span>
                </div>
                <Button 
                  onClick={() => setStep("billing")}
                  className="bg-amber-500 hover:bg-amber-600 text-white gap-2"
                >
                  Continue with {selectedPlanDetails?.name}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Billing Info */}
          {step === "billing" && (
            <motion.div
              key="billing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-amber-500" />
                    School Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">School Name *</Label>
                      <Input 
                        placeholder="Delhi Public School"
                        className="bg-slate-700 border-slate-600 text-white mt-1"
                        value={billingInfo.schoolName}
                        onChange={(e) => setBillingInfo({...billingInfo, schoolName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Email Address *</Label>
                      <Input 
                        type="email"
                        placeholder="admin@school.edu"
                        className="bg-slate-700 border-slate-600 text-white mt-1"
                        value={billingInfo.email}
                        onChange={(e) => setBillingInfo({...billingInfo, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Phone Number *</Label>
                      <Input 
                        placeholder="+91 98765 43210"
                        className="bg-slate-700 border-slate-600 text-white mt-1"
                        value={billingInfo.phone}
                        onChange={(e) => setBillingInfo({...billingInfo, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">GST Number (Optional)</Label>
                      <Input 
                        placeholder="22AAAAA0000A1Z5"
                        className="bg-slate-700 border-slate-600 text-white mt-1"
                        value={billingInfo.gstNumber}
                        onChange={(e) => setBillingInfo({...billingInfo, gstNumber: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-300">Address</Label>
                    <Input 
                      placeholder="Complete school address"
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                      value={billingInfo.address}
                      onChange={(e) => setBillingInfo({...billingInfo, address: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">{productName} - {selectedPlanDetails?.name}</span>
                    <span className="text-white">{selectedPlanDetails?.price}</span>
                  </div>
                  <Separator className="bg-slate-700" />
                  <div className="flex justify-between font-medium">
                    <span className="text-white">Total</span>
                    <span className="text-amber-400">{selectedPlanDetails?.price}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between pt-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setStep("plan")}
                  className="text-slate-400"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleBillingSubmit}
                  className="bg-amber-500 hover:bg-amber-600 text-white gap-2"
                >
                  Continue to Payment
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Payment */}
          {step === "payment" && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-amber-500" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-slate-300">Card Number</Label>
                    <Input 
                      placeholder="4242 4242 4242 4242"
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">Expiry Date</Label>
                      <Input 
                        placeholder="MM/YY"
                        className="bg-slate-700 border-slate-600 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">CVV</Label>
                      <Input 
                        placeholder="123"
                        type="password"
                        className="bg-slate-700 border-slate-600 text-white mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <Lock className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400">256-bit SSL encrypted payment</span>
                  </div>
                </CardContent>
              </Card>

              {/* Final Summary */}
              <Card className="bg-amber-500/10 border-amber-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{selectedPlanDetails?.name} Plan</p>
                      <p className="text-sm text-slate-400">{productName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-amber-400">{selectedPlanDetails?.price}</p>
                      <p className="text-xs text-slate-400">Billed annually</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between pt-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setStep("billing")}
                  className="text-slate-400"
                  disabled={isProcessing}
                >
                  Back
                </Button>
                <Button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white gap-2 min-w-40"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Pay {selectedPlanDetails?.price}
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <BadgeCheck className="w-10 h-10 text-white" />
              </motion.div>

              <h3 className="text-2xl font-bold text-white mb-2">
                🎉 Purchase Successful!
              </h3>
              <p className="text-slate-400 mb-6">
                Your {productName} is now LIVE and ready to use
              </p>

              <Card className="bg-slate-800 border-slate-700 mb-6">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <p className="text-slate-400 text-sm">Plan</p>
                      <p className="text-white font-medium">{selectedPlanDetails?.name}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Amount Paid</p>
                      <p className="text-amber-400 font-medium">{selectedPlanDetails?.price}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Status</p>
                      <Badge className="bg-green-500/20 text-green-400">LIVE</Badge>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Validity</p>
                      <p className="text-white font-medium">1 Year</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-center gap-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg mb-6">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-green-400">All your trial data has been preserved</span>
              </div>

              <Button 
                onClick={handleComplete}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Go to Live System
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default TrialPurchaseModal;
