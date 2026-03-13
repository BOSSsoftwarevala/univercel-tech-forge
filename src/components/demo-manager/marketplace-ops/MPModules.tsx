import { ScrollArea } from "@/components/ui/scroll-area";
import { Layers } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPModules = () => (
  <ScrollArea className="h-screen">
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
          <Layers className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Modules</h1>
          <p className="text-sm text-muted-foreground">Product modules and feature bundles</p>
        </div>
      </div>
      <EmptyState icon={<Layers className="w-12 h-12" />} title="No modules configured" description="Define product modules to allow modular purchasing and feature toggling" />
    </div>
  </ScrollArea>
);

export default MPModules;
