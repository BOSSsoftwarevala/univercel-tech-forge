import { ScrollArea } from "@/components/ui/scroll-area";
import { HeadphonesIcon } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPSupport = () => {
  return (
    <ScrollArea className="h-screen">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <HeadphonesIcon className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Customer Support</h1>
            <p className="text-sm text-muted-foreground">Marketplace support tickets and inquiries</p>
          </div>
        </div>
        <EmptyState icon={<HeadphonesIcon className="w-12 h-12" />} title="No support tickets" description="Customer support requests will appear here" />
      </div>
    </ScrollArea>
  );
};

export default MPSupport;
