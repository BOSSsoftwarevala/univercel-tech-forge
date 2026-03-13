import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPDemoViews = () => (
  <ScrollArea className="h-screen">
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
          <Eye className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Demo Views Analytics</h1>
          <p className="text-sm text-muted-foreground">Track demo viewing patterns and engagement</p>
        </div>
      </div>
      <EmptyState icon={<Eye className="w-12 h-12" />} title="No view data" description="Track demo views, session durations, bounce rates, and conversion funnels" />
    </div>
  </ScrollArea>
);

export default MPDemoViews;
