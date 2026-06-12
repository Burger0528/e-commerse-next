import { getCurrentMonthReport } from "@/services/salesReportService";
import { sendSalesReportEmail } from "@/lib/email";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret || auth !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const report = await getCurrentMonthReport();
    await sendSalesReportEmail(report);
    return Response.json({ ok: true, report });
  } catch (error) {
    console.error("[cron] sales-report error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
