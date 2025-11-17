import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MoreHorizontal, Mail, Phone } from "lucide-react";

export function LeadsTable() {
  const leads = [
    {
      id: 1,
      name: "Sarah Mitchell",
      company: "TechCorp Solutions",
      email: "sarah.m@techcorp.com",
      phone: "+1 (555) 123-4567",
      status: "hot",
      value: "$45,000",
      source: "Website"
    },
    {
      id: 2,
      name: "Michael Chen",
      company: "Global Innovations Inc",
      email: "m.chen@globalinno.com",
      phone: "+1 (555) 234-5678",
      status: "warm",
      value: "$32,500",
      source: "Referral"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      company: "StartUp Ventures",
      email: "emily@startupv.com",
      phone: "+1 (555) 345-6789",
      status: "cold",
      value: "$18,000",
      source: "LinkedIn"
    },
    {
      id: 4,
      name: "James Thompson",
      company: "Enterprise Systems Ltd",
      email: "j.thompson@entsys.com",
      phone: "+1 (555) 456-7890",
      status: "hot",
      value: "$67,800",
      source: "Trade Show"
    },
    {
      id: 5,
      name: "Lisa Park",
      company: "Digital Dynamics",
      email: "lisa.park@digidyn.com",
      phone: "+1 (555) 567-8901",
      status: "warm",
      value: "$28,400",
      source: "Email Campaign"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "hot":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "warm":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "cold":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-zinc-50">Active Leads</CardTitle>
        <CardDescription className="text-zinc-500">Manage and track your sales pipeline</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
              <TableHead className="text-zinc-400">Contact</TableHead>
              <TableHead className="text-zinc-400">Company</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400">Value</TableHead>
              <TableHead className="text-zinc-400">Source</TableHead>
              <TableHead className="text-zinc-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id} className="border-zinc-800 hover:bg-zinc-800/50">
                <TableCell>
                  <div>
                    <div className="text-zinc-50">{lead.name}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <a href={`mailto:${lead.email}`} className="text-xs text-zinc-500 hover:text-violet-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {lead.email}
                      </a>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-300">{lead.company}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-50">{lead.value}</TableCell>
                <TableCell className="text-zinc-400">{lead.source}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-50">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
