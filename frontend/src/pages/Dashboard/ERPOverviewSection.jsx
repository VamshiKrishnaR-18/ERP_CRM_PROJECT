import React from "react";
import { MetricsOverview } from "../../components/erp/MetricsOverview";
import { SalesCharts } from "../../components/erp/SalesCharts";
import { RecentActivities } from "../../components/erp/RecentActivities";
import { LeadsTable } from "../../components/erp/LeadsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/erp/ui/tabs";

// ERP dashboard section that uses the shared ERP components
export default function ERPOverviewSection({ dashboardData }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Dashboard Overview
          </h2>
          <p className="text-sm text-muted-foreground">
            Welcome back! Here's what's happening today.
          </p>
        </div>
      </div>

      <MetricsOverview dashboardData={dashboardData} />

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="border border-border">
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
  );
}

