import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ProductCard from "@/components/ProductCard";
import { getFavoriteProducts } from "@/services/favoritesService";
import { getSession } from "@/lib/session";

export default async function FavoritesPage({
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
  const products = await getFavoriteProducts(session.userId);

  return (
    <Box sx={{ backgroundColor: "background.default", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: 960, mx: "auto", px: 2, py: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          {t("favorites.title")}
        </Typography>

        {products.length === 0 ? (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {t("favorites.empty")}
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {products.map((product) => (
              <Grid key={product._id} size={{ xs: 6, sm: 4, md: 3 }}>
                <ProductCard
                  product={product}
                  isAuthenticated={true}
                  isFavorite={true}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
