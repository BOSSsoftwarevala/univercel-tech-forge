import { ScrollArea } from "@/components/ui/scroll-area";
import { Star } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPRatings = () => (
  <ScrollArea className="h-screen">
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
          <Star className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Ratings</h1>
          <p className="text-sm text-muted-foreground">Product ratings and score management</p>
        </div>
      </div>
      <EmptyState icon={<Star className="w-12 h-12" />} title="No ratings data" description="View and moderate product ratings, average scores, and rating distributions" />
    </div>
  </ScrollArea>
);

export default MPRatings;
