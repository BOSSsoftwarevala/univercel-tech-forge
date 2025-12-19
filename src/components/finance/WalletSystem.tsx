import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Lock, 
  Unlock,
  TrendingUp,
  RefreshCcw,
  ExternalLink
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const WalletSystem = () => {
  const roleWallets = [
    {
      role: "Reseller Pool",
      icon: "RS",
      color: "from-blue-500 to-blue-600",
      earned: 24580,
      pending: 3420,
      locked: 1200,
      released: 19960,
      commissionRate: "15%",
      transactions: 156,
    },
    {
      role: "Franchise Pool",
      icon: "FR",
      color: "from-purple-500 to-purple-600",
      earned: 89420,
      pending: 12500,
      locked: 6150,
      released: 70770,
      commissionRate: "40-60%",
      transactions: 89,
    },
    {
      role: "Influencer Pool",
      icon: "IN",
      color: "from-pink-500 to-pink-600",
      earned: 8940,
      pending: 1523,
      locked: 0,
      released: 7417,
      commissionRate: "CPC+Conv",
      transactions: 234,
    },
    {
      role: "Developer Pool",
      icon: "DV",
      color: "from-cyan-500 to-cyan-600",
      earned: 45670,
      pending: 4890,
      locked: 890,
      released: 39890,
      commissionRate: "Task-based",
      transactions: 412,
    },
  ];

  const escrowTransactions = [
    { id: "ESC-001", client: "ABC Corp", amount: 249, status: "locked", daysRemaining: 5, type: "Lifetime License" },
    { id: "ESC-002", client: "XYZ Ltd", amount: 730, status: "locked", daysRemaining: 12, type: "SaaS Annual" },
    { id: "ESC-003", client: "DEF Inc", amount: 249, status: "releasing", daysRemaining: 1, type: "Lifetime License" },
    { id: "ESC-004", client: "GHI Corp", amount: 730, status: "released", daysRemaining: 0, type: "SaaS Annual" },
  ];

  const recentWalletActivity = [
    { action: "Commission Released", wallet: "Reseller Pool", amount: 37.35, time: "2 min ago", positive: true },
    { action: "Escrow Locked", wallet: "System", amount: 249, time: "15 min ago", positive: false },
    { action: "Developer Payment", wallet: "Developer Pool", amount: 150, time: "1 hr ago", positive: false },
    { action: "Franchise Share", wallet: "Franchise Pool", amount: 1240, time: "2 hr ago", positive: true },
    { action: "Penalty Applied", wallet: "Developer Pool", amount: -50, time: "3 hr ago", positive: false },
  ];

  const pricingRules = [
    { product: "Lifetime Software License", price: "$249", fixed: true },
    { product: "SaaS Annual Subscription", price: "$730", fixed: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Wallet System</h1>
          <p className="text-slate-500 text-sm">Role-based wallet management with escrow tracking</p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCcw className="w-4 h-4 mr-2" />
          Sync All Wallets
        </Button>
      </div>

      {/* Pricing Rules Banner */}
      <Card className="bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 border-cyan-200 dark:border-cyan-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-cyan-800 dark:text-cyan-300">Fixed Pricing - No Negotiation</p>
              <p className="text-sm text-cyan-600 dark:text-cyan-400">All products have fixed pricing. No discounts allowed.</p>
            </div>
            <div className="flex gap-4">
              {pricingRules.map((rule, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-lg px-4 py-2 border border-cyan-200 dark:border-cyan-700">
                  <p className="text-xs text-slate-500">{rule.product}</p>
                  <p className="text-lg font-bold text-cyan-600">{rule.price}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Wallets */}
      <div className="grid grid-cols-2 gap-4">
        {roleWallets.map((wallet, index) => (
          <Card key={index} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${wallet.color} flex items-center justify-center text-white font-bold text-sm`}>
                    {wallet.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{wallet.role}</p>
                    <p className="text-xs text-slate-500">{wallet.transactions} transactions • {wallet.commissionRate}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <TrendingUp className="w-4 h-4 mx-auto text-cyan-500 mb-1" />
                  <p className="text-xs text-slate-500">Earned</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">${wallet.earned.toLocaleString()}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <RefreshCcw className="w-4 h-4 mx-auto text-yellow-500 mb-1" />
                  <p className="text-xs text-slate-500">Pending</p>
                  <p className="text-sm font-semibold text-yellow-600">${wallet.pending.toLocaleString()}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <Lock className="w-4 h-4 mx-auto text-red-500 mb-1" />
                  <p className="text-xs text-slate-500">Locked</p>
                  <p className="text-sm font-semibold text-red-600">${wallet.locked.toLocaleString()}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <Unlock className="w-4 h-4 mx-auto text-cyan-500 mb-1" />
                  <p className="text-xs text-slate-500">Released</p>
                  <p className="text-sm font-semibold text-cyan-600">${wallet.released.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Available for withdrawal</span>
                  <span>{Math.round((wallet.released / wallet.earned) * 100)}%</span>
                </div>
                <Progress value={(wallet.released / wallet.earned) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Escrow & Activity Tabs */}
      <Tabs defaultValue="escrow" className="w-full">
        <TabsList className="bg-slate-100 dark:bg-slate-800">
          <TabsTrigger value="escrow">Escrow Transactions</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="escrow">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Active Escrow Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {escrowTransactions.map((tx, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                        tx.status === 'locked' ? 'bg-red-100 dark:bg-red-900/30' :
                        tx.status === 'releasing' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                        'bg-cyan-100 dark:bg-cyan-900/30'
                      }`}>
                        {tx.status === 'locked' ? <Lock className="w-4 h-4 text-red-600" /> :
                         tx.status === 'releasing' ? <RefreshCcw className="w-4 h-4 text-yellow-600" /> :
                         <Unlock className="w-4 h-4 text-cyan-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{tx.client}</p>
                        <p className="text-xs text-slate-500">{tx.id} • {tx.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">${tx.amount}</p>
                        <p className="text-xs text-slate-500">
                          {tx.daysRemaining > 0 ? `${tx.daysRemaining} days remaining` : 'Completed'}
                        </p>
                      </div>
                      <Badge variant="outline" className={`${
                        tx.status === 'locked' ? 'border-red-300 text-red-600' :
                        tx.status === 'releasing' ? 'border-yellow-300 text-yellow-600' :
                        'border-cyan-300 text-cyan-600'
                      }`}>
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Wallet Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentWalletActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        activity.positive ? 'bg-cyan-100 dark:bg-cyan-900/30' : 'bg-slate-100 dark:bg-slate-700'
                      }`}>
                        {activity.positive ? 
                          <ArrowDownRight className="w-4 h-4 text-cyan-600" /> : 
                          <ArrowUpRight className="w-4 h-4 text-slate-500" />
                        }
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{activity.action}</p>
                        <p className="text-xs text-slate-500">{activity.wallet} • {activity.time}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${
                      activity.amount > 0 && activity.positive ? 'text-cyan-600' : 
                      activity.amount < 0 ? 'text-red-500' : 'text-slate-600'
                    }`}>
                      {activity.amount > 0 && activity.positive ? '+' : ''}${Math.abs(activity.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WalletSystem;
