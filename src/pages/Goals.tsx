import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";

// 1. Interface matching your Mongoose Model exactly
interface Goal {
  _id: string;
  title: string;        // Matches backend 'title'
  targetAmount: number;
  currentAmount: number;
  deadline: string;     // Matches backend 'deadline'
  status: string;       // Matches backend 'status'
}

// 2. Interface for the form input state
interface GoalFormData {
  title: string;
  targetAmount: string;
  currentAmount: string;
  deadline: string;
}

const Goals = () => {
  const API_URL = "https://fintelify.onrender.com/api/goals";

  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<GoalFormData>({
    title: "",
    targetAmount: "",
    currentAmount: "0",
    deadline: "",
  });

  // --- 1. Fetch Goals (GET) ---
  const fetchGoals = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch goals");
      const data = await response.json();
      setGoals(data);
    } catch (error) {
      console.error("Error loading goals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // --- 2. Handle Form Submit (POST) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        targetAmount: Number(formData.targetAmount),
        currentAmount: Number(formData.currentAmount),
        deadline: formData.deadline,
        status: "In Progress" // Default status
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        fetchGoals(); // Refresh list
        setFormData({ title: "", targetAmount: "", currentAmount: "0", deadline: "" }); // Reset form
      } else {
        const err = await response.json();
        alert(`Error: ${err.message}`);
      }
    } catch (error) {
      console.error("Error creating goal:", error);
    }
  };

  // --- 3. Handle Delete (DELETE) ---
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;

    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setGoals(goals.filter((goal) => goal._id !== id)); // Optimistic update
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  // --- 4. Helper for Input Changes ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- 5. Helper for Progress Calculation ---
  const calculateProgress = (current: number, target: number) => {
    if (!target) return 0;
    const percent = (current / target) * 100;
    return Math.min(Math.round(percent), 100);
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Financial Goals</h1>
            <p className="text-muted-foreground">Track your savings and targets.</p>
          </div>
        </div>

        {/* --- ADD GOAL FORM --- */}
        <div className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Add New Goal</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Goal Name</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. New Car"
                className="w-full p-2 rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              />
            </div>

            {/* Target Amount */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Amount (₹)</label>
              <input
                name="targetAmount"
                type="number"
                value={formData.targetAmount}
                onChange={handleChange}
                placeholder="50000"
                className="w-full p-2 rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              />
            </div>

            {/* Current Amount */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Already Saved (₹)</label>
              <input
                name="currentAmount"
                type="number"
                value={formData.currentAmount}
                onChange={handleChange}
                className="w-full p-2 rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Deadline</label>
              <input
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full p-2 rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Create Goal
            </button>
          </form>
        </div>

        {/* --- GOALS LIST --- */}
        {loading ? (
          <p>Loading goals...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => {
              const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
              
              return (
                <div key={goal._id} className="bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg tracking-tight">{goal.title}</h3>
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                        {progress}%
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      Target: {new Date(goal.deadline).toLocaleDateString()}
                    </p>

                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full bg-primary transition-all duration-500 ease-in-out" 
                        style={{ width: `${progress}%` }} 
                      />
                    </div>

                    <div className="flex justify-between text-sm mt-1">
                      <span className="font-medium text-green-600">₹{goal.currentAmount}</span>
                      <span className="text-muted-foreground">of ₹{goal.targetAmount}</span>
                    </div>
                  </div>

                  {/* Footer with Delete Button */}
                  <div className="bg-muted/50 p-4 border-t flex justify-end">
                    <button
                      onClick={() => handleDelete(goal._id)}
                      className="text-sm text-red-500 hover:text-red-700 hover:underline font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
            
            {goals.length === 0 && (
              <div className="col-span-full text-center py-10 text-muted-foreground">
                You haven't added any goals yet. Start by creating one above!
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Goals;
