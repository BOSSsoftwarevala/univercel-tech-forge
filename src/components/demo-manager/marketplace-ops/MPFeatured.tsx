import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPFeatured = () => {
  return (
    <ScrollArea className="h-screen">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Featured Products</h1>
            <p className="text-sm text-muted-foreground">Manage which products are featured on marketplace homepage</p>
          </div>
        </div>
        <EmptyState icon={<TrendingUp className="w-12 h-12" />} title="No featured products" description="Mark products as featured to highlight them on the marketplace" />
      </div>
    </ScrollArea>
  );
};

export default MPFeatured;
