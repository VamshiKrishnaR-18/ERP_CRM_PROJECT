import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import {
  UserPlus,
  ShoppingCart,
  DollarSign,
  Package,
  Mail,
  Calendar,
} from "lucide-react";

export function RecentActivities() {
  const activities = [
    {
      id: 1,
      type: "customer",
      icon: UserPlus,
      color: "from-blue-600 to-cyan-600",
      title: "New customer registered",
      description: "Sarah Mitchell from TechCorp Solutions joined",
      time: "2 minutes ago",
    },
    {
      id: 2,
      type: "order",
      icon: ShoppingCart,
      color: "from-emerald-600 to-green-600",
      title: "Order #4523 completed",
      description: "Payment received for $2,450.00",
      time: "15 minutes ago",
    },
    {
      id: 3,
      type: "payment",
      icon: DollarSign,
      color: "from-violet-600 to-purple-600",
      title: "Payment processed",
      description: "Invoice #INV-2847 paid by Global Innovations",
      time: "1 hour ago",
    },
    {
      id: 4,
      type: "inventory",
      icon: Package,
      color: "from-orange-600 to-red-600",
      title: "Low stock alert",
      description: "Product SKU-8291 has only 12 units remaining",
      time: "2 hours ago",
    },
    {
      id: 5,
      type: "email",
      icon: Mail,
      color: "from-pink-600 to-rose-600",
      title: "Email campaign sent",
      description: "Newsletter sent to 2,847 subscribers",
      time: "3 hours ago",
    },
    {
      id: 6,
      type: "meeting",
      icon: Calendar,
      color: "from-amber-600 to-yellow-600",
      title: "Meeting scheduled",
      description: "Sales call with Enterprise Systems Ltd",
      time: "4 hours ago",
    },
  ];

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-zinc-50">Recent Activities</CardTitle>
        <CardDescription className="text-zinc-500">
          Latest updates from your business
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
            >
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${activity.color} flex items-center justify-center flex-shrink-0`}
              >
                <activity.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-zinc-50">{activity.title}</p>
                <p className="text-sm text-zinc-400 mt-0.5">
                  {activity.description}
                </p>
              </div>
              <div className="text-xs text-zinc-500 flex-shrink-0">
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

