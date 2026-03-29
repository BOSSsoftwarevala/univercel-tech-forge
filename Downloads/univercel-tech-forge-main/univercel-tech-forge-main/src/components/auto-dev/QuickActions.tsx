import { motion } from "framer-motion";
import { 
  Building2, ShoppingCart, Users, Utensils, 
  GraduationCap, Stethoscope, Car, Plane,
  Briefcase, Wallet, MessageSquare, Bug
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuickActionsProps {
  onAction: (action: string) => void;
}

export const QuickActions = ({ onAction }: QuickActionsProps) => {
  const quickBuilds = [
    { id: 'restaurant', label: 'Restaurant POS', icon: Utensils, color: 'text-orange-400 bg-orange-500/20' },
    { id: 'retail', label: 'Retail Store', icon: ShoppingCart, color: 'text-blue-400 bg-blue-500/20' },
    { id: 'school', label: 'School ERP', icon: GraduationCap, color: 'text-green-400 bg-green-500/20' },
    { id: 'hospital', label: 'Hospital CRM', icon: Stethoscope, color: 'text-red-400 bg-red-500/20' },
    { id: 'hr', label: 'HR Portal', icon: Users, color: 'text-violet-400 bg-violet-500/20' },
    { id: 'crm', label: 'Sales CRM', icon: Briefcase, color: 'text-amber-400 bg-amber-500/20' },
    { id: 'accounting', label: 'Accounting', icon: Wallet, color: 'text-emerald-400 bg-emerald-500/20' },
    { id: 'travel', label: 'Travel Booking', icon: Plane, color: 'text-cyan-400 bg-cyan-500/20' },
  ];

  const quickActions = [
    { id: 'support', label: 'Get Support', icon: MessageSquare, color: 'text-blue-400' },
    { id: 'bug', label: 'Report Bug', icon: Bug, color: 'text-red-400' },
  ];

  return (
    <Card className="bg-slate-900/50 border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-violet-400" />
          Quick Start Templates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {quickBuilds.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                variant="ghost"
                onClick={() => onAction(`Create a ${item.label} system`)}
                className={cn(
                  "w-full h-auto flex flex-col items-center gap-2 py-3 px-2",
                  "hover:bg-violet-500/10 group transition-all"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                  item.color,
                  "group-hover:scale-110"
                )}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-white transition-colors text-center leading-tight">
                  {item.label}
                </span>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Utility Actions */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/30">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="ghost"
              size="sm"
              onClick={() => onAction(action.label)}
              className="text-xs text-muted-foreground hover:text-white"
            >
              <action.icon className={cn("w-3 h-3 mr-1", action.color)} />
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
