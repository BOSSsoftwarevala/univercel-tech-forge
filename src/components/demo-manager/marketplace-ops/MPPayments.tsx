import { ScrollArea } from "@/components/ui/scroll-area";
import { CreditCard } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPPayments = () => (
  <ScrollArea className="h-screen">
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Payments</h1>
          <p className="text-sm text-muted-foreground">Payment processing and transaction history</p>
        </div>
      </div>
      <EmptyState icon={<CreditCard className="w-12 h-12" />} title="No payment records" description="View payment history, processing status, and payment method details" />
    </div>
  </ScrollArea>
);

export default MPPayments;
