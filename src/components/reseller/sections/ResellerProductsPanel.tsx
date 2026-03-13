import { Card, CardContent } from '@/components/ui/card';
import { Package, DollarSign, FileText, Globe } from 'lucide-react';

const W = { dark: '#1a1f36', gray: '#858796', border: '#e3e6f0' };

export default function ResellerProductsPanel({ activeView }: { activeView: string }) {
  const titles: Record<string, string> = {
    prod_catalog: 'Product Catalog', prod_pricing: 'Pricing & Plans',
    prod_licenses: 'Licenses', prod_demos: 'Demo Access',
  };
  const icons: Record<string, React.ElementType> = {
    prod_catalog: Package, prod_pricing: DollarSign, prod_licenses: FileText, prod_demos: Globe,
  };
  const Icon = icons[activeView] || Package;

  return (
    <div className="space-y-4">
      <h2 className="text-[18px] font-bold" style={{ color: W.dark }}>{titles[activeView] || 'Products'}</h2>
      <Card className="border" style={{ borderColor: W.border }}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-16">
            <Icon className="w-12 h-12 mb-3 opacity-20" style={{ color: W.gray }} />
            <p className="text-[13px]" style={{ color: W.gray }}>No {(titles[activeView] || 'product').toLowerCase()} data yet</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
