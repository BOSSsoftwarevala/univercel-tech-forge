import { ScrollArea } from "@/components/ui/scroll-area";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPUserProducts = () => (
  <ScrollArea className="h-screen">
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Products</h1>
          <p className="text-sm text-muted-foreground">View products assigned to users</p>
        </div>
      </div>
      <EmptyState icon={<Users className="w-12 h-12" />} title="No user-product assignments" description="Track which products are assigned to which users and their access levels" />
    </div>
  </ScrollArea>
);

export default MPUserProducts;
