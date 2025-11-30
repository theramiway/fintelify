import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts";

const AnalyticsWidget = () => {
  const data = [
    { name: "0d", value: 0 },
    { name: "3d", value: 0 },
    { name: "6d", value: 0 },
    { name: "9d", value: 4200 },
    { name: "12d", value: 1800 },
  ];

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h2 className="text-lg font-semibold text-foreground mb-6">Analytics</h2>
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Total spent (30d)</p>
          <p className="text-xl font-bold text-foreground">₹5,120</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Top category</p>
          <p className="text-xl font-bold text-foreground">rent</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Transactions</p>
          <p className="text-xl font-bold text-foreground">4</p>
        </div>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsWidget;
