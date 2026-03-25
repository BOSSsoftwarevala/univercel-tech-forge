import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPTrending = () => (
  <ScrollArea className="h-screen">
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trending Products</h1>
          <p className="text-sm text-muted-foreground">Manage trending and popular product listings</p>
        </div>
      </div>
      <EmptyState icon={<TrendingUp className="w-12 h-12" />} title="No trending data" description="Products are automatically ranked by views, purchases, and engagement metrics" />
    </div>
  </ScrollArea>
);

export default MPTrending;
