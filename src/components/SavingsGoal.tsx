const SavingsGoal = () => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h2 className="text-lg font-semibold text-foreground mb-2">Savings Goal</h2>
      <p className="text-sm text-muted-foreground mb-4">1 goal(s)</p>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-foreground font-medium">Trip to Goa</span>
          <span className="text-muted-foreground text-sm">₹10,000 / ₹25,000 (40%)</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: "40%" }}></div>
        </div>
      </div>
    </div>
  );
};

export default SavingsGoal;
