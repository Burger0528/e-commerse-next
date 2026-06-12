import nodemailer from "nodemailer";

export interface SalesReport {
  month: string;
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
}

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendWelcomeEmail(name: string, email: string): Promise<void> {
  if (!process.env.SMTP_HOST) {
    console.warn("[email] SMTP_HOST not set — skipping welcome email");
    return;
  }
  await createTransport().sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "¡Bienvenido a Simulacro!",
    html: `
      <div style="font-family:-apple-system,system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="font-weight:700;margin:0 0 12px">¡Bienvenido, ${name}!</h2>
        <p style="color:#6e6e73;margin:0 0 16px">Tu cuenta fue creada exitosamente en Simulacro.</p>
        <p style="color:#6e6e73;margin:0">Ya puedes explorar el catálogo, guardar favoritos y agregar productos al carrito.</p>
        <br>
        <p style="color:#1c1c1e;margin:0">— El equipo de Simulacro</p>
      </div>
    `,
  });
}

export async function sendSalesReportEmail(report: SalesReport): Promise<void> {
  const to = process.env.REPORT_TO;
  if (!process.env.SMTP_HOST || !to) {
    throw new Error("SMTP_HOST y REPORT_TO son requeridos para enviar el reporte");
  }
  await createTransport().sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `Reporte de ventas — ${report.month}`,
    html: `
      <div style="font-family:-apple-system,system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="font-weight:700;margin:0 0 20px">Reporte mensual de ventas</h2>
        <p style="color:#6e6e73;margin:0 0 20px">Período: <strong>${report.month}</strong></p>
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #e5e5ea;color:#6e6e73">Pedidos del mes</td>
            <td style="padding:10px 0;border-bottom:1px solid #e5e5ea;font-weight:600;text-align:right">${report.totalSales}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #e5e5ea;color:#6e6e73">Ingresos totales</td>
            <td style="padding:10px 0;border-bottom:1px solid #e5e5ea;font-weight:600;text-align:right">$${report.totalRevenue.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#6e6e73">Ticket promedio</td>
            <td style="padding:10px 0;font-weight:600;text-align:right">$${report.averageOrderValue.toFixed(2)}</td>
          </tr>
        </table>
      </div>
    `,
  });
}
