import { DashboardLayout } from "./components/DashboardLayout";
import { MetricsOverview } from "./components/MetricsOverview";
import { SalesCharts } from "./components/SalesCharts";
import { RecentActivities } from "./components/RecentActivities";
import { LeadsTable } from "./components/LeadsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-zinc-50">Dashboard Overview</h1>
              <p className="text-zinc-400">Welcome back! Here's what's happening today.</p>
            </div>
          </div>

          <MetricsOverview />

          <Tabs defaultValue="analytics" className="w-full">
            <TabsList className="bg-zinc-900 border border-zinc-800">
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>
            
            <TabsContent value="analytics" className="space-y-6">
              <SalesCharts />
            </TabsContent>
            
            <TabsContent value="leads">
              <LeadsTable />
            </TabsContent>
            
            <TabsContent value="activities">
              <RecentActivities />
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </div>
  );
}
