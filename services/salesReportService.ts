import { getDb } from "@/lib/mongodb";
import type { SaleDocument } from "@/lib/types";
import type { SalesReport } from "@/lib/email";

export async function getCurrentMonthReport(): Promise<SalesReport> {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const db = await getDb();
  const sales = await db
    .collection<SaleDocument>("sales")
    .find({ createdAt: { $gte: start, $lt: end } })
    .toArray();

  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

  const month = now.toLocaleDateString("es-ES", { month: "long", year: "numeric" });

  return { month, totalSales, totalRevenue, averageOrderValue };
}
