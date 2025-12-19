import { motion } from 'framer-motion';
import { Wallet, ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';

interface WalletData {
  name: string;
  balance: number;
  change: number;
  color: string;
}

const wallets: WalletData[] = [
  { name: 'Admin Wallet', balance: 2847293, change: 12.4, color: 'bg-gradient-to-r from-primary to-neon-teal' },
  { name: 'Franchise Pool', balance: 847293, change: 8.2, color: 'bg-gradient-to-r from-neon-green to-neon-teal' },
  { name: 'Reseller Commission', balance: 234892, change: -2.1, color: 'bg-gradient-to-r from-neon-orange to-neon-red' },
  { name: 'Developer Payouts', balance: 128490, change: 5.7, color: 'bg-gradient-to-r from-neon-purple to-neon-blue' },
  { name: 'Influencer Fund', balance: 89234, change: 15.3, color: 'bg-gradient-to-r from-neon-cyan to-primary' },
];

const WalletOverview = ({ delay = 0 }: { delay?: number }) => {
  const totalBalance = wallets.reduce((acc, wallet) => acc + wallet.balance, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="glass-panel p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Wallet Ecosystem</h3>
        <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Total Balance */}
      <div className="glass-panel-glow p-4 rounded-xl mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground">Total Balance</span>
        </div>
        <div className="font-mono text-3xl font-bold text-foreground">
          ${totalBalance.toLocaleString()}
        </div>
        <div className="flex items-center gap-1 mt-1 text-neon-green text-xs">
          <ArrowUpRight className="w-3 h-3" />
          <span>+8.4% from last month</span>
        </div>
      </div>

      {/* Individual Wallets */}
      <div className="space-y-3">
        {wallets.map((wallet, index) => (
          <motion.div
            key={wallet.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + (index * 0.05) }}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer"
          >
            <div className={`w-2 h-8 rounded-full ${wallet.color}`} />
            <div className="flex-1">
              <div className="text-sm text-foreground">{wallet.name}</div>
              <div className="font-mono text-xs text-muted-foreground">
                ${wallet.balance.toLocaleString()}
              </div>
            </div>
            <div className={`flex items-center gap-1 text-xs ${wallet.change >= 0 ? 'text-neon-green' : 'text-neon-red'}`}>
              {wallet.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              <span>{Math.abs(wallet.change)}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default WalletOverview;