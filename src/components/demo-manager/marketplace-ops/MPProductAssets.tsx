import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderOpen } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPProductAssets = () => (
  <ScrollArea className="h-screen">
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center">
          <FolderOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Product Assets</h1>
          <p className="text-sm text-muted-foreground">Manage logos, icons, and media for each product</p>
        </div>
      </div>
      <EmptyState icon={<FolderOpen className="w-12 h-12" />} title="No assets uploaded" description="Upload product logos, thumbnails, icons, and media files" />
    </div>
  </ScrollArea>
);

export default MPProductAssets;
