import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPNotifications = () => (
  <ScrollArea className="h-screen">
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground">Marketplace notification management</p>
        </div>
      </div>
      <EmptyState icon={<Bell className="w-12 h-12" />} title="No notifications" description="Configure notification triggers for orders, reviews, and marketplace events" />
    </div>
  </ScrollArea>
);

export default MPNotifications;
