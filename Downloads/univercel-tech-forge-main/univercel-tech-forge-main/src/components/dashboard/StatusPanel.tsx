import { motion } from 'framer-motion';

interface StatusItem {
  label: string;
  value: number;
  max: number;
  color: string;
}

interface StatusPanelProps {
  title: string;
  items: StatusItem[];
  delay?: number;
}

const StatusPanel = ({ title, items, delay = 0 }: StatusPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="glass-panel p-4"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.label}>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-mono text-foreground">
                {item.value}/{item.max}
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / item.max) * 100}%` }}
                transition={{ delay: delay + (index * 0.1), duration: 0.5 }}
                className={`h-full ${item.color} rounded-full`}
                style={{
                  boxShadow: `0 0 10px ${item.color.includes('cyan') ? 'hsl(187 100% 50% / 0.5)' : 
                    item.color.includes('green') ? 'hsl(142 76% 50% / 0.5)' :
                    item.color.includes('orange') ? 'hsl(25 95% 53% / 0.5)' :
                    item.color.includes('purple') ? 'hsl(280 100% 65% / 0.5)' : 'hsl(187 100% 50% / 0.5)'}`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default StatusPanel;