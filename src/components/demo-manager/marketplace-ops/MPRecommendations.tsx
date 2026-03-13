import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPRecommendations = () => (
  <ScrollArea className="h-screen">
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Recommendations</h1>
          <p className="text-sm text-muted-foreground">AI-powered product recommendation engine</p>
        </div>
      </div>
      <EmptyState icon={<Sparkles className="w-12 h-12" />} title="No recommendation rules" description="Configure recommendation algorithms, 'Similar Products', and 'Users Also Bought' sections" />
    </div>
  </ScrollArea>
);

export default MPRecommendations;
