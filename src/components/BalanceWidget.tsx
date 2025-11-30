const BalanceWidget = () => {
  return (
    <div>
      <h3 className="text-sm text-muted-foreground mb-4">Current balance</h3>
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 56}`}
            strokeDashoffset={`${2 * Math.PI * 56 * 0.25}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-foreground">₹9,880</span>
        </div>
      </div>
    </div>
  );
};

export default BalanceWidget;
