import { motion } from 'framer-motion';
import { Activity, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

const heatmapData = [
  { hour: '00', mon: 12, tue: 8, wed: 15, thu: 10, fri: 20, sat: 5, sun: 3 },
  { hour: '04', mon: 5, tue: 3, wed: 8, thu: 4, fri: 6, sat: 2, sun: 1 },
  { hour: '08', mon: 45, tue: 52, wed: 48, thu: 55, fri: 60, sat: 15, sun: 10 },
  { hour: '12', mon: 78, tue: 82, wed: 75, thu: 88, fri: 95, sat: 35, sun: 25 },
  { hour: '16', mon: 65, tue: 70, wed: 62, thu: 72, fri: 80, sat: 28, sun: 18 },
  { hour: '20', mon: 40, tue: 45, wed: 38, thu: 48, fri: 55, sat: 40, sun: 35 },
];

const costData = [
  { hour: '00:00', cost: 12.50 },
  { hour: '02:00', cost: 8.20 },
  { hour: '04:00', cost: 5.80 },
  { hour: '06:00', cost: 15.40 },
  { hour: '08:00', cost: 45.60 },
  { hour: '10:00', cost: 78.90 },
  { hour: '12:00', cost: 92.30 },
  { hour: '14:00', cost: 85.40 },
  { hour: '16:00', cost: 72.10 },
  { hour: '18:00', cost: 58.20 },
  { hour: '20:00', cost: 42.50 },
  { hour: '22:00', cost: 28.80 },
];

const TrafficMonitorScreen = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground font-mono flex items-center gap-3">
          <Activity className="w-6 h-6 text-primary" />
          AI Traffic Monitor
        </h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          Real-time data
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heatmap */}
        <motion.div 
          className="metric-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-foreground">Traffic Heatmap</span>
            <TrendingUp className="w-4 h-4 text-neon-cyan" />
          </div>
          
          <div className="overflow-x-auto">
            <div className="min-w-[400px]">
              <div className="grid grid-cols-8 gap-1 text-xs text-muted-foreground mb-2">
                <div></div>
                <div className="text-center">Mon</div>
                <div className="text-center">Tue</div>
                <div className="text-center">Wed</div>
                <div className="text-center">Thu</div>
                <div className="text-center">Fri</div>
                <div className="text-center">Sat</div>
                <div className="text-center">Sun</div>
              </div>
              {heatmapData.map((row, idx) => (
                <div key={idx} className="grid grid-cols-8 gap-1 mb-1">
                  <div className="text-xs text-muted-foreground flex items-center">{row.hour}:00</div>
                  {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => {
                    const value = row[day as keyof typeof row] as number;
                    const intensity = Math.min(value / 100, 1);
                    return (
                      <motion.div
                        key={day}
                        className="h-8 rounded"
                        style={{
                          backgroundColor: `hsla(var(--neon-cyan), ${intensity})`,
                          opacity: 0.3 + intensity * 0.7
                        }}
                        whileHover={{ scale: 1.1 }}
                        title={`${value} requests`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-neon-cyan/20" />
              <span className="text-xs text-muted-foreground">Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-neon-cyan/60" />
              <span className="text-xs text-muted-foreground">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-neon-cyan" />
              <span className="text-xs text-muted-foreground">High</span>
            </div>
          </div>
        </motion.div>

        {/* Hourly Cost Chart */}
        <motion.div 
          className="metric-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-foreground">Hour-wise Cost</span>
            <DollarSign className="w-4 h-4 text-neon-orange" />
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={costData}>
                <defs>
                  <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--neon-orange))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--neon-orange))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="hour" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={10}
                  tickLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cost']}
                />
                <Area 
                  type="monotone" 
                  dataKey="cost" 
                  stroke="hsl(var(--neon-orange))" 
                  fillOpacity={1} 
                  fill="url(#costGradient)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Peak Hour', value: '12:00 PM', icon: Clock, color: 'neon-cyan' },
          { label: 'Total Requests', value: '847,293', icon: Activity, color: 'neon-green' },
          { label: 'Avg Response', value: '145ms', icon: TrendingUp, color: 'neon-purple' },
          { label: 'Total Cost Today', value: '$847.32', icon: DollarSign, color: 'neon-orange' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              className="metric-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 text-${stat.color}`} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <span className="text-xl font-bold text-foreground">{stat.value}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TrafficMonitorScreen;
