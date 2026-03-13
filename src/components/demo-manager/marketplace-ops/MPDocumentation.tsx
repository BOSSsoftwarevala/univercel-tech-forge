import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPDocumentation = () => (
  <ScrollArea className="h-screen">
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Documentation</h1>
          <p className="text-sm text-muted-foreground">Product documentation and user guides</p>
        </div>
      </div>
      <EmptyState icon={<BookOpen className="w-12 h-12" />} title="No documentation" description="Add product documentation, API references, and user guides" />
    </div>
  </ScrollArea>
);

export default MPDocumentation;
