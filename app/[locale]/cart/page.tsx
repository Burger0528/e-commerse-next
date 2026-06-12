import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { getCartWithProducts } from "@/services/cartService";
import { getSession } from "@/lib/session";
import CartView from "@/components/CartView";

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();

  if (!session.userId) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations();
  const items = await getCartWithProducts(session.userId);

  return (
    <Box sx={{ backgroundColor: "background.default", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: 640, mx: "auto", px: 2, py: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          {t("cart.title")}
        </Typography>
        <CartView items={items} />
      </Box>
    </Box>
  );
}
