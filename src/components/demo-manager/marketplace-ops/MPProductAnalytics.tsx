import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart3 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPProductAnalytics = () => (
  <ScrollArea className="h-screen">
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Product Analytics</h1>
          <p className="text-sm text-muted-foreground">Per-product performance metrics and insights</p>
        </div>
      </div>
      <EmptyState icon={<BarChart3 className="w-12 h-12" />} title="No analytics data" description="View product-level metrics: views, conversions, revenue, and engagement trends" />
    </div>
  </ScrollArea>
);

export default MPProductAnalytics;
