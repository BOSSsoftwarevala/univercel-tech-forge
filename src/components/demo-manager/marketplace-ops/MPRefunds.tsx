import { ScrollArea } from "@/components/ui/scroll-area";
import { RotateCcw } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPRefunds = () => (
  <ScrollArea className="h-screen">
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
          <RotateCcw className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Refunds</h1>
          <p className="text-sm text-muted-foreground">Process and track refund requests</p>
        </div>
      </div>
      <EmptyState icon={<RotateCcw className="w-12 h-12" />} title="No refund requests" description="Review pending refund requests, process approvals, and track refund history" />
    </div>
  </ScrollArea>
);

export default MPRefunds;
