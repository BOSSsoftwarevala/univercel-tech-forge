import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  Treemap, ComposedChart
} from 'recharts';

const PALETTE = [
  'hsl(270, 80%, 60%)', // violet
  'hsl(200, 80%, 55%)', // blue
  'hsl(160, 70%, 50%)', // emerald
  'hsl(40, 90%, 55%)',  // amber
  'hsl(340, 75%, 55%)', // rose
  'hsl(180, 60%, 50%)', // cyan
  'hsl(30, 85%, 55%)',  // orange
  'hsl(280, 60%, 55%)', // purple
];

const tooltipStyle = {
  contentStyle: {
    background: 'hsl(222, 47%, 11%)',
    border: '1px solid hsl(217, 33%, 25%)',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#fff',
  },
  itemStyle: { color: '#cbd5e1' },
};

// ─── Revenue Area Chart ─────────────────────────────────────────
export function RevenueAreaChart({ data }: { data: { month: string; revenue: number; target: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(270, 80%, 60%)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="hsl(270, 80%, 60%)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(200, 80%, 55%)" stopOpacity={0.2} />
            <stop offset="95%" stopColor="hsl(200, 80%, 55%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" />
        <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
        <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
        <Tooltip {...tooltipStyle} formatter={(v: number) => [`₹${v.toLocaleString()}`, '']} />
        <Area type="monotone" dataKey="target" stroke="hsl(200, 80%, 55%)" fill="url(#targetGrad)" strokeDasharray="5 5" name="Target" />
        <Area type="monotone" dataKey="revenue" stroke="hsl(270, 80%, 60%)" fill="url(#revGrad)" strokeWidth={2} name="Revenue" />
        <Legend />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Module Performance Bar Chart ────────────────────────────────
export function ModuleBarChart({ data }: { data: { module: string; actions: number; errors: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} barGap={2}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" />
        <XAxis dataKey="module" stroke="#64748b" fontSize={10} angle={-30} textAnchor="end" height={60} />
        <YAxis stroke="#64748b" fontSize={11} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="actions" fill="hsl(270, 80%, 60%)" radius={[4, 4, 0, 0]} name="Actions" />
        <Bar dataKey="errors" fill="hsl(340, 75%, 55%)" radius={[4, 4, 0, 0]} name="Errors" />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Role Distribution Pie Chart ─────────────────────────────────
export function RoleDistributionPie({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
          fontSize={10}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip {...tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ─── System Health Radar ─────────────────────────────────────────
export function SystemHealthRadar({ data }: { data: { metric: string; score: number; benchmark: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="hsl(217, 33%, 25%)" />
        <PolarAngleAxis dataKey="metric" stroke="#94a3b8" fontSize={10} />
        <PolarRadiusAxis stroke="#475569" fontSize={9} />
        <Radar name="Current" dataKey="score" stroke="hsl(270, 80%, 60%)" fill="hsl(270, 80%, 60%)" fillOpacity={0.3} />
        <Radar name="Benchmark" dataKey="benchmark" stroke="hsl(160, 70%, 50%)" fill="hsl(160, 70%, 50%)" fillOpacity={0.1} strokeDasharray="4 4" />
        <Legend />
        <Tooltip {...tooltipStyle} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// ─── Activity Timeline ───────────────────────────────────────────
export function ActivityTimeline({ data }: { data: { hour: string; events: number; critical: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" />
        <XAxis dataKey="hour" stroke="#64748b" fontSize={10} />
        <YAxis stroke="#64748b" fontSize={11} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="events" fill="hsl(200, 80%, 55%)" opacity={0.4} radius={[2, 2, 0, 0]} name="Total Events" />
        <Line type="monotone" dataKey="critical" stroke="hsl(340, 75%, 55%)" strokeWidth={2} dot={false} name="Critical" />
        <Legend />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

// ─── KPI Sparkline (mini chart for KPI cards) ────────────────────
export function KPISparkline({ data, color = 'hsl(270, 80%, 60%)' }: { data: number[]; color?: string }) {
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id={`spark-${color.replace(/[^a-z0-9]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.4} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} fill={`url(#spark-${color.replace(/[^a-z0-9]/gi, '')})`} strokeWidth={1.5} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Category Treemap ────────────────────────────────────────────
const TREEMAP_COLORS = PALETTE;

interface TreemapContentProps {
  x: number; y: number; width: number; height: number; index: number; name: string; value: number;
}

function TreemapContent({ x, y, width, height, index, name, value }: TreemapContentProps) {
  if (width < 40 || height < 30) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={TREEMAP_COLORS[index % TREEMAP_COLORS.length]} opacity={0.85} rx={4} />
      <text x={x + width / 2} y={y + height / 2 - 6} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={600}>{name}</text>
      <text x={x + width / 2} y={y + height / 2 + 10} textAnchor="middle" fill="#e2e8f0" fontSize={9}>{value}</text>
    </g>
  );
}

export function CategoryTreemap({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <Treemap data={data} dataKey="value" nameKey="name" content={<TreemapContent x={0} y={0} width={0} height={0} index={0} name="" value={0} />} />
    </ResponsiveContainer>
  );
}
