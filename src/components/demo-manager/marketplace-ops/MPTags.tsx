import { ScrollArea } from "@/components/ui/scroll-area";
import { Tags } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPTags = () => (
  <ScrollArea className="h-screen">
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
          <Tags className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Tags</h1>
          <p className="text-sm text-muted-foreground">Create and assign product tags for filtering</p>
        </div>
      </div>
      <EmptyState icon={<Tags className="w-12 h-12" />} title="No tags created yet" description="Tags help users find products faster through search and filtering" />
    </div>
  </ScrollArea>
);

export default MPTags;
