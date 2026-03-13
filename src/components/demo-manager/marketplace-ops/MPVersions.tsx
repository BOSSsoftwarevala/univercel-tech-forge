import { ScrollArea } from "@/components/ui/scroll-area";
import { GitBranch } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPVersions = () => (
  <ScrollArea className="h-screen">
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
          <GitBranch className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Versions</h1>
          <p className="text-sm text-muted-foreground">Track and manage product version releases</p>
        </div>
      </div>
      <EmptyState icon={<GitBranch className="w-12 h-12" />} title="No versions tracked" description="Manage product version history, changelogs, and rollback capabilities" />
    </div>
  </ScrollArea>
);

export default MPVersions;
