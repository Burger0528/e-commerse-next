"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { logoutAction } from "@/app/actions/auth";

interface NavbarClientProps {
  user: { name: string; email: string } | null;
}

export default function NavbarClient({ user }: NavbarClientProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [pending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction(locale);
    });
  };

  return (
    <Box
      component="nav"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "rgba(242,242,247,0.88)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid",
        borderColor: "divider",
        px: 2,
        py: 1,
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      {/* Brand */}
      <Typography
        component={Link}
        href="/"
        variant="subtitle2"
        sx={{ fontWeight: 700, color: "text.primary", flex: 1, textDecoration: "none" }}
      >
        {t("common.appName")}
      </Typography>

      {/* Language */}
      <LanguageSwitcher label={t("common.language")} />

      {/* Auth area */}
      {user ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 28,
              height: 28,
              fontSize: 13,
              fontWeight: 700,
              bgcolor: "#1c1c1e",
              color: "#fff",
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
            {user.name}
          </Typography>
          <Button
            component={Link}
            href="/favorites"
            size="small"
            variant="text"
            sx={{ fontSize: 12, color: "text.secondary", minWidth: 0, px: 1 }}
          >
            {t("favorites.title")}
          </Button>
          <Button
            component={Link}
            href="/cart"
            size="small"
            variant="text"
            sx={{ fontSize: 12, color: "text.secondary", minWidth: 0, px: 1 }}
          >
            {t("cart.title")}
          </Button>
          <Button
            variant="text"
            size="small"
            disabled={pending}
            onClick={handleLogout}
            sx={{ fontSize: 12, color: "text.secondary", minWidth: 0, px: 1 }}
          >
            {t("auth.logout")}
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            component={Link}
            href="/login"
            size="small"
            variant="text"
            sx={{ fontSize: 12, color: "text.secondary" }}
          >
            {t("auth.login")}
          </Button>
          <Button
            component={Link}
            href="/register"
            size="small"
            variant="contained"
            sx={{ fontSize: 12, borderRadius: 2, px: 2 }}
          >
            {t("auth.register")}
          </Button>
        </Box>
      )}
    </Box>
  );
}
