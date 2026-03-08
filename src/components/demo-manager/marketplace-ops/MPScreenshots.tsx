import { ScrollArea } from "@/components/ui/scroll-area";
import { Monitor } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPScreenshots = () => (
  <ScrollArea className="h-screen">
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 flex items-center justify-center">
          <Monitor className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Screenshots</h1>
          <p className="text-sm text-muted-foreground">Product screenshots and preview images</p>
        </div>
      </div>
      <EmptyState icon={<Monitor className="w-12 h-12" />} title="No screenshots uploaded" description="Upload product screenshots for marketplace gallery display" />
    </div>
  </ScrollArea>
);

export default MPScreenshots;
