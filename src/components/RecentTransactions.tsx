const RecentTransactions = () => {
  const transactions = [
    { amount: "₹3,500", label: "Rent", category: "rent" },
    { amount: "₹1,200", label: "Groceries", category: "groceries" },
    { amount: "₹420", label: "Dinner", category: "dining" },
    { amount: "₹15,000", label: "Salary", category: "income" },
  ];

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h2 className="text-lg font-semibold text-foreground mb-2">Recent transactions</h2>
      <p className="text-sm text-muted-foreground mb-4">You have {transactions.length} transactions</p>
      <ul className="space-y-3">
        {transactions.map((transaction, index) => (
          <li key={index} className="flex items-center gap-3 text-sm">
            <span className="text-foreground font-medium">{transaction.amount}</span>
            <span className="text-muted-foreground">— {transaction.label}</span>
            <span className="text-muted-foreground">({transaction.category})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentTransactions;
