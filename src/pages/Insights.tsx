import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";

// 1. Interface matching your Mongoose Model
interface Insight {
  _id: string;
  text: string;
  title?: string;           // Optional
  relatedCategory?: string; // Optional
  date: string;             // ISO Date string
  createdAt: string;
}

// 2. Interface for the form state
interface InsightFormData {
  title: string;
  text: string;
  date: string;
  relatedCategory: string;
}

const Insights = () => {
  const API_URL = "https://fintelify.onrender.com/api/insights";

  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize form with today's date
  const [formData, setFormData] = useState<InsightFormData>({
    title: "",
    text: "",
    date: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
    relatedCategory: ""
  });

  // --- 1. Fetch Insights (GET) ---
  const fetchInsights = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setInsights(data);
    } catch (error) {
      console.error("Error loading insights:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  // --- 2. Handle Form Submit (POST) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.text.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Reset form but keep date as today
        setFormData({
          title: "",
          text: "",
          date: new Date().toISOString().split('T')[0],
          relatedCategory: ""
        });
        fetchInsights(); // Refresh the list
      } else {
        const err = await response.json();
        alert(`Failed: ${err.message}`);
      }
    } catch (error) {
      console.error("Error saving insight:", error);
    }
  };

  // --- 3. Handle Delete (DELETE) ---
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      // Optimistic update: remove from UI immediately
      setInsights(insights.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  // --- 4. Input Change Helper ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Financial Insights</h1>
          <p className="text-muted-foreground">
            Journal your spending habits, track patterns, and reflect on your financial goals.
          </p>
        </div>

        {/* --- INPUT FORM --- */}
        <div className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Add New Reflection</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Title Input */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium">Title (Optional)</label>
                <input
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Monthly Budget Review"
                  className="w-full p-2 rounded-md border bg-background text-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {/* Date Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <input
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md border bg-background text-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            {/* Category Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category (Optional)</label>
              <input
                name="relatedCategory"
                type="text"
                value={formData.relatedCategory}
                onChange={handleChange}
                placeholder="e.g. Dining Out, Travel, Savings"
                className="w-full p-2 rounded-md border bg-background text-sm focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            {/* Text Area (Main Observation) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Observation / Analysis</label>
              <textarea
                name="text"
                value={formData.text}
                onChange={handleChange}
                placeholder="Write your analysis here..."
                className="w-full p-3 rounded-md border bg-background min-h-[100px] focus:ring-2 focus:ring-primary outline-none resize-none"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md font-medium transition-colors shadow-sm"
              >
                Save Insight
              </button>
            </div>
          </form>
        </div>

        {/* --- LIST OF INSIGHTS --- */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Your Journal</h2>

          {loading ? (
            <p>Loading...</p>
          ) : insights.length === 0 ? (
            <div className="text-center py-10 border border-dashed rounded-xl bg-muted/20">
              <p className="text-muted-foreground">No insights yet. Write your first reflection above!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {insights.map((item) => (
                <div key={item._id} className="bg-card text-card-foreground p-6 rounded-lg border border-border shadow-sm group relative hover:shadow-md transition-all">
                  
                  {/* Card Header: Date & Category */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      {new Date(item.date).toLocaleDateString(undefined, {
                        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </span>
                    {item.relatedCategory && (
                      <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full font-medium">
                        {item.relatedCategory}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  {item.title && (
                    <h3 className="text-lg font-bold mb-2 text-primary">{item.title}</h3>
                  )}

                  {/* Main Text */}
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                    {item.text}
                  </p>

                  {/* Delete Button (Visible on Hover) */}
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    title="Delete Entry"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Insights;
