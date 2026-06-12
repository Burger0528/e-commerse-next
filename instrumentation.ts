export async function register() {
  // Only schedule in the Node.js runtime (not Edge), and only in production
  // or when explicitly enabled in development via ENABLE_CRON=true
  if (
    process.env.NEXT_RUNTIME !== "nodejs" ||
    (process.env.NODE_ENV !== "production" && process.env.ENABLE_CRON !== "true")
  ) {
    return;
  }

  const cron = await import("node-cron");
  const { getCurrentMonthReport } = await import("./services/salesReportService");
  const { sendSalesReportEmail } = await import("./lib/email");

  // Runs every day at 09:00 server time
  cron.default.schedule("0 9 * * *", async () => {
    console.log("[cron] Running daily sales report...");
    try {
      const report = await getCurrentMonthReport();
      await sendSalesReportEmail(report);
      console.log(`[cron] Sales report sent for ${report.month}`);
    } catch (error) {
      console.error("[cron] Failed to send sales report:", error);
    }
  });

  console.log("[cron] Daily sales report scheduled at 09:00");
}
