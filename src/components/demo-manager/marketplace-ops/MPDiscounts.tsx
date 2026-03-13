import { ScrollArea } from "@/components/ui/scroll-area";
import { Percent } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPDiscounts = () => {
  return (
    <ScrollArea className="h-screen">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Percent className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Discounts & Coupons</h1>
            <p className="text-sm text-muted-foreground">Manage promotional offers and coupon codes</p>
          </div>
        </div>
        <EmptyState icon={<Percent className="w-12 h-12" />} title="No discounts configured" description="Create discount codes and promotional offers here" />
      </div>
    </ScrollArea>
  );
};

export default MPDiscounts;
