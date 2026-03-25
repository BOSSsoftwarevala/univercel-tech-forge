// Continent Super Admin - Performance Screen
import { motion } from 'framer-motion';
import { TrendingUp, Target, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const PerformanceView = () => {
  const countryPerformance = [
    { country: 'South Africa', growth: 24, target: 85, actual: 92 },
    { country: 'Nigeria', growth: 18, target: 80, actual: 78 },
    { country: 'Kenya', growth: 22, target: 75, actual: 81 },
    { country: 'Ghana', growth: 15, target: 70, actual: 72 },
    { country: 'Egypt', growth: 12, target: 80, actual: 68 },
    { country: 'Morocco', growth: 20, target: 75, actual: 79 },
  ];

  const growthTrendData = [
    { month: 'Jan', growth: 12, revenue: 45000 },
    { month: 'Feb', growth: 14, revenue: 52000 },
    { month: 'Mar', growth: 11, revenue: 48000 },
    { month: 'Apr', growth: 15, revenue: 58000 },
    { month: 'May', growth: 18, revenue: 65000 },
    { month: 'Jun', growth: 16, revenue: 62000 },
    { month: 'Jul', growth: 19, revenue: 71000 },
    { month: 'Aug', growth: 21, revenue: 78000 },
    { month: 'Sep', growth: 18, revenue: 72000 },
    { month: 'Oct', growth: 22, revenue: 85000 },
    { month: 'Nov', growth: 24, revenue: 92000 },
    { month: 'Dec', growth: 26, revenue: 98000 },
  ];

  const quarterlyData = [
    { quarter: 'Q1', actual: 145000, target: 140000, growth: 12 },
    { quarter: 'Q2', actual: 185000, target: 170000, growth: 15 },
    { quarter: 'Q3', actual: 221000, target: 200000, growth: 18 },
    { quarter: 'Q4', actual: 275000, target: 240000, growth: 22 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Performance</h1>
        <p className="text-muted-foreground">Country-wise performance metrics and analytics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Average Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-500">+18.5%</div>
              <p className="text-xs text-muted-foreground">vs last quarter</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Target className="h-4 w-4" />
                Target Achievement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">78%</div>
              <p className="text-xs text-muted-foreground">continent average</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Top Performer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">South Africa</div>
              <p className="text-xs text-muted-foreground">+24% growth</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Growth Trend Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            Growth Trend (Monthly)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="growth" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2 }}
                  name="Growth %"
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                  name="Revenue ($)"
                  yAxisId={0}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Quarterly Performance Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            Quarterly Performance (Actual vs Target)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="quarter" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
                <Legend />
                <Bar dataKey="target" fill="#6366f1" name="Target" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" fill="#10b981" name="Actual" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Country Performance Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Country-wise Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {countryPerformance.map((country, index) => (
              <motion.div
                key={country.country}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-background rounded-lg border border-border"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-foreground">{country.country}</span>
                  <span className={`font-bold ${country.growth >= 18 ? 'text-emerald-500' : 'text-amber-500'}`}>
                    +{country.growth}%
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Target vs Actual</span>
                      <span className={country.actual >= country.target ? 'text-emerald-500' : 'text-red-500'}>
                        {country.actual}% / {country.target}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${country.actual >= country.target ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${Math.min((country.actual / country.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceView;
