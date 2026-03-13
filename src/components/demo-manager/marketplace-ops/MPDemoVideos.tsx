import { ScrollArea } from "@/components/ui/scroll-area";
import { Video } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPDemoVideos = () => (
  <ScrollArea className="h-screen">
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
          <Video className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Demo Videos</h1>
          <p className="text-sm text-muted-foreground">Manage product demo and tutorial videos</p>
        </div>
      </div>
      <EmptyState icon={<Video className="w-12 h-12" />} title="No demo videos" description="Upload or link product demo videos, tutorials, and walkthroughs" />
    </div>
  </ScrollArea>
);

export default MPDemoVideos;
