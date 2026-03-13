import { ScrollArea } from "@/components/ui/scroll-area";
import { Image } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPBanners = () => (
  <ScrollArea className="h-screen">
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
          <Image className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Banners</h1>
          <p className="text-sm text-muted-foreground">Marketplace hero banners and promotional images</p>
        </div>
      </div>
      <EmptyState icon={<Image className="w-12 h-12" />} title="No banners configured" description="Upload hero banners, promotional images, and seasonal campaigns for the marketplace storefront" />
    </div>
  </ScrollArea>
);

export default MPBanners;
