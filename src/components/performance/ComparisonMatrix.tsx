import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, ArrowLeftRight, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";

export const ComparisonMatrix = () => {
  const [comparisonType, setComparisonType] = useState<"region" | "role" | "period">("region");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Comparison Matrix
          </h2>
          <p className="text-slate-400 text-sm mt-1">Data-only comparison — pure metrics</p>
        </div>
        <div className="flex items-center gap-2">
          {[
            { id: "region", label: "Region vs Region" },
            { id: "role", label: "Role vs Role" },
            { id: "period", label: "Period vs Period" },
          ].map((type) => (
            <Button
              key={type.id}
              variant={comparisonType === type.id ? "default" : "outline"}
              size="sm"
              onClick={() => setComparisonType(type.id as any)}
              className={comparisonType === type.id ? "bg-cyan-600 hover:bg-cyan-700" : "border-slate-600 text-slate-400 hover:text-white"}
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      <Card className="bg-slate-900/50 border-slate-700/50 p-8">
        <EmptyState 
          icon={<BarChart3 className="w-6 h-6 text-muted-foreground/50" />}
          title="No comparison data available" 
          description="Comparison metrics will populate as performance data is collected from regions, roles, and periods" 
        />
      </Card>
    </div>
  );
};
