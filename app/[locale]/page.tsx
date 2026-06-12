import { getTranslations } from "next-intl/server";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ProductCard from "@/components/ProductCard";
import { listProducts } from "@/services/productService";
import { getFavoriteIds } from "@/services/favoritesService";
import { getSession } from "@/lib/session";

export default async function CatalogPage() {
  const t = await getTranslations();
  const [products, session] = await Promise.all([listProducts(), getSession()]);
  const isAuthenticated = Boolean(session.userId);

  const favoriteIds = isAuthenticated ? await getFavoriteIds(session.userId) : [];

  return (
    <Box sx={{ backgroundColor: "background.default", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: 960, mx: "auto", px: 2, py: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          {t("catalog.title")}
        </Typography>

        {products.length === 0 ? (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {t("catalog.empty")}
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {products.map((product) => (
              <Grid key={product._id} size={{ xs: 6, sm: 4, md: 3 }}>
                <ProductCard
                  product={product}
                  isAuthenticated={isAuthenticated}
                  isFavorite={favoriteIds.includes(product._id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
