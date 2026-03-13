import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutDashboard } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPHomepage = () => (
  <ScrollArea className="h-screen">
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
          <LayoutDashboard className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Homepage</h1>
          <p className="text-sm text-muted-foreground">Configure marketplace homepage layout and content</p>
        </div>
      </div>
      <EmptyState icon={<LayoutDashboard className="w-12 h-12" />} title="Homepage not configured" description="Design the marketplace homepage with hero sections, product rows, and CTAs" />
    </div>
  </ScrollArea>
);

export default MPHomepage;
