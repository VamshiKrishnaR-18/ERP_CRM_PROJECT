import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/erp/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/erp/ui/card";
import { ThemeToggle } from "../../components/erp/ThemeToggle";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your workspace preferences.
        </p>
      </div>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="border border-border">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="text-base text-foreground">Theme</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-foreground">Dark / Light mode</p>
                    <p className="text-xs text-muted-foreground">
                      Switch between light and dark theme for the ERP dashboard.
                    </p>
                  </div>
                  <ThemeToggle />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

