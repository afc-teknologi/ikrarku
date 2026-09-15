import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
export default function ActivityChart({
  data,
}: {
  data: { day: string; confirmed: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#125946" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#125946" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#ece8df"
        />
        <XAxis dataKey="day" axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="confirmed"
          stroke="#125946"
          strokeWidth={2.5}
          fill="url(#fill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
