import { motion } from "framer-motion";
import { 
  PlayCircle, 
  CreditCard, 
  User, 
  Settings, 
  Package, 
  GraduationCap, 
  FileCheck,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const onboardingSteps = [
  { id: "demo", label: "Demo", icon: PlayCircle },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "assignment", label: "Dev Assignment", icon: User },
  { id: "setup", label: "Setup", icon: Settings },
  { id: "delivery", label: "Delivery", icon: Package },
  { id: "training", label: "Training", icon: GraduationCap },
  { id: "signoff", label: "Sign-off", icon: FileCheck },
  { id: "postcheck", label: "Post-Check", icon: CheckCircle },
];

const clients = [
  {
    id: "1",
    name: "TechCorp Solutions",
    currentStep: 7,
    startDate: "Dec 1, 2024",
    expectedEnd: "Dec 20, 2024",
    progress: 87,
    status: "on-track",
    assignedTo: "vala(cs)2341",
  },
  {
    id: "2",
    name: "GlobalRetail Inc",
    currentStep: 5,
    startDate: "Dec 5, 2024",
    expectedEnd: "Dec 25, 2024",
    progress: 62,
    status: "on-track",
    assignedTo: "vala(cs)4556",
  },
  {
    id: "3",
    name: "StartupX",
    currentStep: 3,
    startDate: "Dec 10, 2024",
    expectedEnd: "Dec 28, 2024",
    progress: 35,
    status: "delayed",
    assignedTo: "vala(cs)2341",
  },
  {
    id: "4",
    name: "Enterprise Plus",
    currentStep: 8,
    startDate: "Nov 15, 2024",
    expectedEnd: "Dec 10, 2024",
    progress: 100,
    status: "completed",
    assignedTo: "vala(cs)7891",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "on-track": return "bg-teal-100 text-teal-700 border-teal-200";
    case "delayed": return "bg-rose-100 text-rose-700 border-rose-200";
    default: return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

export const OnboardingTracker = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Onboarding Flow Tracker</h2>
          <p className="text-slate-500 text-sm mt-1">Track client journey from demo to success</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600">Completed</span>
          </span>
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-teal-500" />
            <span className="text-slate-600">Current</span>
          </span>
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-300" />
            <span className="text-slate-600">Pending</span>
          </span>
        </div>
      </div>

      {/* Client Onboarding Cards */}
      <div className="space-y-4">
        {clients.map((client, index) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-5 bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
              {/* Client Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-slate-800">{client.name}</h3>
                    <Badge className={getStatusColor(client.status)}>
                      {client.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {client.status === "delayed" && <AlertCircle className="w-3 h-3 mr-1" />}
                      {client.status === "on-track" && <Clock className="w-3 h-3 mr-1" />}
                      {client.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {client.startDate} → {client.expectedEnd} | Assigned: {client.assignedTo}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-teal-600">{client.progress}%</p>
                  <p className="text-xs text-slate-500">Complete</p>
                </div>
              </div>

              {/* Step Timeline */}
              <div className="relative">
                {/* Progress Bar Background */}
                <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200 rounded-full" />
                <motion.div 
                  className="absolute top-5 left-0 h-1 bg-gradient-to-r from-teal-500 to-amber-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(client.currentStep / onboardingSteps.length) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />

                {/* Steps */}
                <div className="relative flex justify-between">
                  {onboardingSteps.map((step, stepIndex) => {
                    const Icon = step.icon;
                    const isCompleted = stepIndex < client.currentStep;
                    const isCurrent = stepIndex === client.currentStep - 1;
                    
                    return (
                      <motion.div
                        key={step.id}
                        className="flex flex-col items-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: stepIndex * 0.1 }}
                      >
                        <motion.div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                            isCompleted 
                              ? "bg-gradient-to-r from-teal-500 to-emerald-500 border-teal-500 text-white shadow-lg shadow-teal-500/30" 
                              : isCurrent
                                ? "bg-gradient-to-r from-amber-400 to-orange-400 border-amber-400 text-white shadow-lg shadow-amber-500/30"
                                : "bg-white border-slate-300 text-slate-400"
                          }`}
                          animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 1.5, repeat: isCurrent ? Infinity : 0 }}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Icon className="w-5 h-5" />
                          )}
                        </motion.div>
                        <span className={`text-xs mt-2 ${
                          isCompleted || isCurrent ? "text-slate-700 font-medium" : "text-slate-400"
                        }`}>
                          {step.label}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
