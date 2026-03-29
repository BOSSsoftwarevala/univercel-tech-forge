import { ScrollArea } from "@/components/ui/scroll-area";
import { MonitorPlay } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPProductDemos = () => (
  <ScrollArea className="h-screen">
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
          <MonitorPlay className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Product Demos</h1>
          <p className="text-sm text-muted-foreground">Manage live demo instances for each product</p>
        </div>
      </div>
      <EmptyState icon={<MonitorPlay className="w-12 h-12" />} title="No demos configured" description="Link live demo URLs, credentials, and role-based access for each product" />
    </div>
  </ScrollArea>
);

export default MPProductDemos;
