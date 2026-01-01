import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tag, Plus, Percent, Calendar } from 'lucide-react';

const coupons = [
  { code: 'SAVE20', type: 'percent', value: 20, uses: 45, limit: 100, expiry: '2025-01-31', status: 'active' },
  { code: 'FLAT50', type: 'flat', value: 50, uses: 12, limit: 50, expiry: '2025-02-15', status: 'active' },
  { code: 'NEWYEAR', type: 'percent', value: 15, uses: 100, limit: 100, expiry: '2024-12-31', status: 'expired' },
];

const DiscountsScreen = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Tag className="w-6 h-6 text-emerald-400" />
          Discounts & Coupons
        </h2>
        <p className="text-slate-400">Manage discount codes and promotions</p>
      </div>
      <Button className="bg-emerald-600 hover:bg-emerald-700">
        <Plus className="w-4 h-4 mr-2" />
        Create Coupon
      </Button>
    </div>

    <Card className="bg-slate-900/50 border-slate-700">
      <CardContent className="p-4">
        <div className="space-y-3">
          {coupons.map((coupon) => (
            <div key={coupon.code} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50">
              <div>
                <div className="flex items-center gap-2">
                  <code className="font-mono font-bold text-white">{coupon.code}</code>
                  <Badge className={coupon.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}>
                    {coupon.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                  <span>{coupon.type === 'percent' ? `${coupon.value}% off` : `$${coupon.value} off`}</span>
                  <span>•</span>
                  <span>{coupon.uses}/{coupon.limit} uses</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{coupon.expiry}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-slate-600">Edit</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default DiscountsScreen;
