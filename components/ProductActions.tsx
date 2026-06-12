"use client";

import { useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import { addToCartAction } from "@/app/actions/cart";

interface ProductActionsProps {
  isAuthenticated: boolean;
  productId: string;
  addToCartLabel: string;
  buyLabel: string;
  loginRequiredLabel: string;
}

export default function ProductActions({
  isAuthenticated,
  productId,
  addToCartLabel,
  buyLabel,
  loginRequiredLabel,
}: ProductActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const guard = (fn: () => void) => () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fn();
  };

  const handleAddToCart = guard(() => {
    startTransition(async () => {
      await addToCartAction(productId);
    });
  });

  const handleBuy = guard(() => {
    startTransition(async () => {
      await addToCartAction(productId);
      router.push("/cart");
    });
  });

  return (
    <Box sx={{ display: "flex", gap: 1.5, flexDirection: "column" }}>
      {!isAuthenticated && (
        <Typography variant="caption" sx={{ color: "text.secondary", fontStyle: "italic" }}>
          {loginRequiredLabel}
        </Typography>
      )}
      <Box sx={{ display: "flex", gap: 1.5 }}>
        <Button
          onClick={handleAddToCart}
          variant="outlined"
          disabled={isPending}
          startIcon={<ShoppingCartOutlinedIcon />}
          sx={{
            flex: 1,
            borderRadius: 2,
            fontWeight: 600,
            borderColor: "divider",
            color: "text.primary",
            "&:hover": { borderColor: "text.primary", backgroundColor: "transparent" },
          }}
        >
          {addToCartLabel}
        </Button>
        <Button
          onClick={handleBuy}
          variant="contained"
          disabled={isPending}
          startIcon={<BoltRoundedIcon />}
          sx={{ flex: 1, borderRadius: 2, fontWeight: 600, backgroundColor: "#1c1c1e" }}
        >
          {buyLabel}
        </Button>
      </Box>
    </Box>
  );
}
