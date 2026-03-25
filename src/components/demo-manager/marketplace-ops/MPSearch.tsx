import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPSearch = () => (
  <ScrollArea className="h-screen">
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
          <Search className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Search</h1>
          <p className="text-sm text-muted-foreground">Search configuration and analytics</p>
        </div>
      </div>
      <EmptyState icon={<Search className="w-12 h-12" />} title="Search engine ready" description="Configure search weights, synonyms, and view search query analytics" />
    </div>
  </ScrollArea>
);

export default MPSearch;
