import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutList } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPSections = () => (
  <ScrollArea className="h-screen">
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
          <LayoutList className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Sections</h1>
          <p className="text-sm text-muted-foreground">Configure marketplace page sections and layouts</p>
        </div>
      </div>
      <EmptyState icon={<LayoutList className="w-12 h-12" />} title="No sections defined" description="Create custom sections like 'New Arrivals', 'Top Rated', 'Staff Picks' for the marketplace" />
    </div>
  </ScrollArea>
);

export default MPSections;
