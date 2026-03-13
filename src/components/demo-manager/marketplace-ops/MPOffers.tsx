import { ScrollArea } from "@/components/ui/scroll-area";
import { Gift } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPOffers = () => (
  <ScrollArea className="h-screen">
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
          <Gift className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Offers</h1>
          <p className="text-sm text-muted-foreground">Create and manage promotional offers</p>
        </div>
      </div>
      <EmptyState icon={<Gift className="w-12 h-12" />} title="No active offers" description="Create time-limited offers, bundle deals, and promotional campaigns" />
    </div>
  </ScrollArea>
);

export default MPOffers;
