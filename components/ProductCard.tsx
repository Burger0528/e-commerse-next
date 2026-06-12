"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import { Link } from "@/i18n/navigation";
import { toggleFavoriteAction } from "@/app/actions/favorites";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  isAuthenticated: boolean;
  isFavorite: boolean;
}

export default function ProductCard({ product, isAuthenticated, isFavorite }: ProductCardProps) {
  const t = useTranslations();
  const router = useRouter();
  const [starred, setStarred] = useState(isFavorite);
  const [, startTransition] = useTransition();

  const handleStar = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setStarred((s) => !s);
    startTransition(async () => {
      try {
        const result = await toggleFavoriteAction(product._id);
        setStarred(result);
      } catch {
        setStarred((s) => !s);
      }
    });
  };

  return (
    <Card
      sx={{
        position: "relative",
        width: "100%",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.15s ease",
        "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.10)" },
      }}
    >
      <IconButton
        aria-label={starred ? t("product.removeFavorite") : t("product.saveFavorite")}
        onClick={handleStar}
        size="small"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 1,
          color: starred ? "#f5a623" : "#c7c7cc",
          backgroundColor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(4px)",
          "&:hover": { backgroundColor: "rgba(255,255,255,0.95)" },
        }}
      >
        {starred ? <StarRoundedIcon fontSize="small" /> : <StarBorderRoundedIcon fontSize="small" />}
      </IconButton>

      <CardActionArea
        component={Link}
        href={`/products/${product._id}`}
        sx={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}
      >
        <Box
          sx={{
            width: "100%",
            aspectRatio: "4 / 3",
            backgroundColor: "#f2f2f7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="caption" sx={{ color: "#aeaeb2", fontWeight: 500, px: 2, textAlign: "center" }}>
            {product.category}
          </Typography>
        </Box>

        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              mb: 0.5,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {product.name}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 1 }}>
            {product.shortDescription}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
            ${product.price.toFixed(2)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
