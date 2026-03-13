import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPAuditLogs = () => (
  <ScrollArea className="h-screen">
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-sm text-muted-foreground">Immutable marketplace action logs</p>
        </div>
      </div>
      <EmptyState icon={<FileText className="w-12 h-12" />} title="No audit entries" description="All marketplace actions are logged immutably for compliance and security" />
    </div>
  </ScrollArea>
);

export default MPAuditLogs;
