import { ScrollArea } from "@/components/ui/scroll-area";
import { Ticket } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPCoupons = () => (
  <ScrollArea className="h-screen">
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
          <Ticket className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Coupons</h1>
          <p className="text-sm text-muted-foreground">Generate and track coupon codes</p>
        </div>
      </div>
      <EmptyState icon={<Ticket className="w-12 h-12" />} title="No coupons created" description="Create coupon codes with usage limits, expiry dates, and discount percentages" />
    </div>
  </ScrollArea>
);

export default MPCoupons;
