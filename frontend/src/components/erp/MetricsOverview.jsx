import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  ShoppingCart,
  Target,
} from "lucide-react";

export function MetricsOverview({ dashboardData }) {
  const totalRevenue = dashboardData?.totalRevenue ?? 0;
  const totalInvoices = dashboardData?.totalInvoices ?? 0;
  const totalCustomers = dashboardData?.totalCustomers ?? 0;
  const pendingInvoices =
    dashboardData?.pendingInvoices ?? dashboardData?.pendingPayments ?? 0;

  const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString()}`;

  const metrics = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "from-emerald-600 to-green-600",
    },
    {
      title: "Total Invoices",
      value: totalInvoices.toLocaleString(),
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      color: "from-blue-600 to-cyan-600",
    },
    {
      title: "Total Customers",
      value: totalCustomers.toLocaleString(),
      change: "+3.4%",
      trend: "up",
      icon: Users,
      color: "from-violet-600 to-purple-600",
    },
    {
      title: "Pending Invoices",
      value: pendingInvoices.toLocaleString(),
      change: "-1.2%",
      trend: "down",
      icon: Target,
      color: "from-orange-600 to-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <Card key={metric.title} className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-zinc-400">
              {metric.title}
            </CardTitle>
            <div
              className={`w-10 h-10 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center`}
            >
              <metric.icon className="w-5 h-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-zinc-50">{metric.value}</div>
            <div className="flex items-center gap-1 mt-1">
              {metric.trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-sm ${
                  metric.trend === "up"
                    ? "text-emerald-500"
                    : "text-red-500"
                }`}
              >
                {metric.change}
              </span>
              <span className="text-sm text-zinc-500">vs last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

