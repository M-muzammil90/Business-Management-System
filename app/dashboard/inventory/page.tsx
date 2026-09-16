import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Boxes, PackageCheck, TrendingUp } from "lucide-react";

const stockStats = [
  { label: "Total Items", value: "4,820", detail: "+120 this month", icon: Boxes },
  { label: "Healthy Stock", value: "3,260", detail: "67.7% coverage", icon: PackageCheck },
  { label: "Low Stock", value: "312", detail: "Needs review", icon: AlertTriangle },
  { label: "Inventory Value", value: "$126.3K", detail: "+8.6%", icon: TrendingUp },
];

const alerts = [
  { name: "Office Chair Pro", sku: "OC-204", stock: 4 },
  { name: "Smart Desk Lamp", sku: "SD-118", stock: 2 },
  { name: "Laptop Stand", sku: "LS-052", stock: 1 },
];

const movements = [
  { item: "Ergo Chair", type: "Stock In", qty: 25, date: "12 Sep 2026" },
  { item: "Desk Organizer", type: "Stock Out", qty: 12, date: "10 Sep 2026" },
  { item: "USB Hub", type: "Adjustment", qty: -3, date: "08 Sep 2026" },
];

export default function InventoryPage() {
  return (
    <DashboardPageShell
      eyebrow="Operations"
      title="Inventory"
      description="Monitor stock levels, values and movement across your warehouse."
      actions={
        <>
          <Button variant="outline" className="h-10 rounded-lg">Export</Button>
          <Button className="h-10 rounded-lg">+ Add Stock</Button>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stockStats.map(({ label, value, detail, icon: Icon }) => (
          <Card key={label} className="border-border/60 bg-card shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-3 text-2xl font-bold tracking-tight">{value}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5 pt-0">
            {alerts.map((item) => (
              <div key={item.sku} className="flex items-center justify-between rounded-xl border bg-muted/20 p-3">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.sku}</p>
                </div>
                <Badge variant="destructive">{item.stock} left</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader>
            <CardTitle>Inventory Movement</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="space-y-3">
              {movements.map((movement) => (
                <div key={`${movement.item}-${movement.date}`} className="flex items-center justify-between rounded-xl border p-3">
                  <div>
                    <p className="font-medium">{movement.item}</p>
                    <p className="text-xs text-muted-foreground">{movement.date}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-medium">{movement.type}</p>
                    <p className={`text-sm ${movement.qty > 0 ? "text-emerald-600" : "text-destructive"}`}>
                      {movement.qty > 0 ? "+" : ""}{movement.qty}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPageShell>
  );
}
