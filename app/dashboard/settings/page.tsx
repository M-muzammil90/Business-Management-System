import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const settings = [
  { name: "Business profile", detail: "Name, logo and legal details" },
  { name: "Team access", detail: "Permissions and role management" },
  { name: "Notifications", detail: "Email, alerts and reminders" },
  { name: "Integrations", detail: "ERP, CRM and payment links" },
];

export default function SettingsPage() {
  return (
    <DashboardPageShell
      eyebrow="System"
      title="Settings"
      description="Configure your workspace, security rules and operational preferences."
      actions={<Button className="h-10 rounded-lg">Save Changes</Button>}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader>
            <CardTitle>Workspace Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5 pt-0">
            {settings.map((setting) => (
              <div key={setting.name} className="flex items-center justify-between rounded-xl border bg-muted/20 p-3">
                <div>
                  <p className="font-medium">{setting.name}</p>
                  <p className="text-sm text-muted-foreground">{setting.detail}</p>
                </div>
                <Badge variant="secondary">Ready</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-5 pt-0">
            <div>
              <p className="text-sm text-muted-foreground">Plan</p>
              <p className="mt-2 text-2xl font-bold">Business Pro</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Security</p>
              <p className="mt-2 text-lg font-semibold">2FA enabled</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Last backup</p>
              <p className="mt-2 text-lg font-semibold">Today, 08:45 AM</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPageShell>
  );
}
