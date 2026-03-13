import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPSettings = () => (
  <ScrollArea className="h-screen">
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
          <p className="text-sm text-muted-foreground">Marketplace configuration and preferences</p>
        </div>
      </div>
      <EmptyState icon={<Settings className="w-12 h-12" />} title="Default settings active" description="Configure marketplace currency, commission rates, approval workflows, and display preferences" />
    </div>
  </ScrollArea>
);

export default MPSettings;
