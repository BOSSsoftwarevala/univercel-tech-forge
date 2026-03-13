import { ScrollArea } from "@/components/ui/scroll-area";
import { Rocket } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPDeploymentLogs = () => (
  <ScrollArea className="h-screen">
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
          <Rocket className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Deployment Logs</h1>
          <p className="text-sm text-muted-foreground">Track product deployment history and status</p>
        </div>
      </div>
      <EmptyState icon={<Rocket className="w-12 h-12" />} title="No deployment logs" description="Deployment history, build status, and rollback records will appear here" />
    </div>
  </ScrollArea>
);

export default MPDeploymentLogs;
