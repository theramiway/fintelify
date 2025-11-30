const BudgetWidget = () => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h2 className="text-lg font-semibold text-foreground mb-4">Budgets</h2>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Dining</span>
          <span className="text-foreground">₹0 / ₹2,500</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: "0%" }}></div>
        </div>
      </div>
    </div>
  );
};

export default BudgetWidget;
