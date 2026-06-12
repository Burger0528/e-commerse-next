"use client";

import { useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { removeFromCartAction, updateQuantityAction } from "@/app/actions/cart";
import { checkoutAction } from "@/app/actions/sales";
import type { CartItemWithProduct } from "@/lib/types";

interface CartViewProps {
  items: CartItemWithProduct[];
}

export default function CartView({ items }: CartViewProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const mutate = (fn: () => Promise<void>) => {
    startTransition(async () => {
      await fn();
      router.refresh();
    });
  };

  const handleIncrement = (productId: string, quantity: number) =>
    mutate(() => updateQuantityAction(productId, quantity + 1));

  const handleDecrement = (productId: string, quantity: number) =>
    quantity === 1
      ? mutate(() => removeFromCartAction(productId))
      : mutate(() => updateQuantityAction(productId, quantity - 1));

  const handleRemove = (productId: string) =>
    mutate(() => removeFromCartAction(productId));

  const handleCheckout = () => {
    startTransition(async () => {
      await checkoutAction(locale);
    });
  };

  if (items.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {t("cart.empty")}
      </Typography>
    );
  }

  return (
    <Box sx={{ opacity: isPending ? 0.5 : 1, transition: "opacity 0.15s ease" }}>
      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
          backgroundColor: "background.paper",
          mb: 3,
        }}
      >
        {items.map((item, i) => (
          <Box key={item.productId}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, px: 2, py: 1.5 }}>
              {/* mini image placeholder */}
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 2,
                  backgroundColor: "#f2f2f7",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography
                  sx={{ color: "#aeaeb2", fontSize: 9, textAlign: "center", px: 0.5, lineHeight: 1.3 }}
                >
                  {item.product.category}
                </Typography>
              </Box>

              {/* name + unit price */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.product.name}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  ${item.product.price.toFixed(2)} {t("cart.perUnit")}
                </Typography>
              </Box>

              {/* quantity stepper */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
                <IconButton
                  size="small"
                  disabled={isPending}
                  onClick={() => handleDecrement(item.productId, item.quantity)}
                  sx={{ color: "text.secondary" }}
                  aria-label={t("cart.remove")}
                >
                  <RemoveRoundedIcon sx={{ fontSize: 16 }} />
                </IconButton>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, minWidth: 24, textAlign: "center" }}
                >
                  {item.quantity}
                </Typography>
                <IconButton
                  size="small"
                  disabled={isPending}
                  onClick={() => handleIncrement(item.productId, item.quantity)}
                  sx={{ color: "text.secondary" }}
                >
                  <AddRoundedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>

              {/* line total */}
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, minWidth: 64, textAlign: "right" }}
              >
                ${(item.product.price * item.quantity).toFixed(2)}
              </Typography>

              {/* delete */}
              <IconButton
                size="small"
                disabled={isPending}
                onClick={() => handleRemove(item.productId)}
                sx={{ color: "text.secondary" }}
                aria-label={t("cart.remove")}
              >
                <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
            {i < items.length - 1 && <Divider />}
          </Box>
        ))}
      </Box>

      {/* total row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          px: 0.5,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {t("cart.total")}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          ${total.toFixed(2)}
        </Typography>
      </Box>

      <Button
        fullWidth
        variant="contained"
        disabled={isPending}
        onClick={handleCheckout}
        sx={{
          borderRadius: 2,
          fontWeight: 600,
          backgroundColor: "#1c1c1e",
          py: 1.5,
          "&:hover": { backgroundColor: "#2c2c2e" },
        }}
      >
        {t("cart.checkout")}
      </Button>
    </Box>
  );
}
