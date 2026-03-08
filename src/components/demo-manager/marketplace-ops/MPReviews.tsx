import { ScrollArea } from "@/components/ui/scroll-area";
import { Star } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPReviews = () => {
  return (
    <ScrollArea className="h-screen">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Star className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reviews & Ratings</h1>
            <p className="text-sm text-muted-foreground">Customer feedback and ratings</p>
          </div>
        </div>
        <EmptyState icon={<Star className="w-12 h-12" />} title="No reviews yet" description="Reviews will appear here when customers provide feedback" />
      </div>
    </ScrollArea>
  );
};

export default MPReviews;
