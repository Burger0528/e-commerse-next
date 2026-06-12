import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { Link } from "@/i18n/navigation";
import { getProductById } from "@/services/productService";
import { getSession } from "@/lib/session";
import ProductActions from "@/components/ProductActions";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations();

  const [product, session] = await Promise.all([getProductById(id), getSession()]);
  if (!product) notFound();

  const isAuthenticated = Boolean(session.userId);

  return (
    <Box sx={{ backgroundColor: "background.default", minHeight: "100vh" }}>
      {/* Back button row */}
      <Box sx={{ px: 1, py: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton
          component={Link}
          href="/"
          size="small"
          aria-label={t("common.back")}
          sx={{ color: "text.primary" }}
        >
          <ArrowBackIosNewRoundedIcon fontSize="small" />
        </IconButton>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }} noWrap>
          {product.name}
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 680, mx: "auto", px: 2, pb: 4 }}>
        {/* Image placeholder */}
        <Box
          sx={{
            width: "100%",
            aspectRatio: "16 / 9",
            backgroundColor: "#e5e5ea",
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="body2" sx={{ color: "#aeaeb2", fontWeight: 500 }}>
            {product.category}
          </Typography>
        </Box>

        {/* Name + price */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, flex: 1, pr: 2 }}>
            {product.name}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
            ${product.price.toFixed(2)}
          </Typography>
        </Box>

        {/* Category + stock chips */}
        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
          <Chip
            label={product.category}
            size="small"
            sx={{ borderRadius: 2, fontSize: 12, backgroundColor: "#e5e5ea", color: "text.secondary" }}
          />
          <Chip
            label={
              product.stock > 0
                ? t("product.stock", { count: product.stock })
                : t("product.outOfStock")
            }
            size="small"
            sx={{
              borderRadius: 2,
              fontSize: 12,
              backgroundColor: product.stock > 0 ? "#e5f5e8" : "#fde8e8",
              color: product.stock > 0 ? "#2d7a3a" : "#c0392b",
            }}
          />
        </Box>

        {/* Short description */}
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          {product.shortDescription}
        </Typography>

        {/* Protected action buttons */}
        <ProductActions
          isAuthenticated={isAuthenticated}
          productId={product._id}
          addToCartLabel={t("product.addToCart")}
          buyLabel={t("product.buy")}
          loginRequiredLabel={t("auth.loginRequired")}
        />

        <Divider sx={{ my: 3 }} />

        {/* Extended description — detail only */}
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          {t("product.description")}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3, lineHeight: 1.7 }}>
          {product.extendedDescription}
        </Typography>

        {/* Specifications — detail only */}
        {product.specifications.length > 0 && (
          <>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              {t("product.specifications")}
            </Typography>
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              {product.specifications.map((spec, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    px: 2,
                    py: 1.25,
                    borderBottom: i < product.specifications.length - 1 ? "1px solid" : "none",
                    borderColor: "divider",
                    backgroundColor: i % 2 === 0 ? "background.paper" : "background.default",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, flex: "0 0 45%" }}>
                    {spec.label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {spec.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
