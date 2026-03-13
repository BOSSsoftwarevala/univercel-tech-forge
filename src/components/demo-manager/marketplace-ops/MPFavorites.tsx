import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPFavorites = () => (
  <ScrollArea className="h-screen">
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Favorites</h1>
          <p className="text-sm text-muted-foreground">User wishlists and favorited products</p>
        </div>
      </div>
      <EmptyState icon={<Heart className="w-12 h-12" />} title="No favorites data" description="Track which products users have favorited and wishlisted" />
    </div>
  </ScrollArea>
);

export default MPFavorites;
