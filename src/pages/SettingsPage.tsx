import DashboardLayout from "@/components/DashboardLayout";

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Settings</h1>
        <p className="text-muted-foreground">Configure your app settings here.</p>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
