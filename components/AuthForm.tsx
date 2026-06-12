"use client";

import { useActionState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { Link } from "@/i18n/navigation";
import type { ActionState } from "@/app/actions/auth";

type Mode = "login" | "register";

interface AuthFormProps {
  mode: Mode;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
}

export default function AuthForm({ mode, action }: AuthFormProps) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(action, undefined);

  const errorKey = state?.error as string | undefined;
  const errorMsg = errorKey
    ? t.raw(`errors.${errorKey}`) ?? t("errors.fields_required")
    : null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        p: 2,
      }}
    >
      <Paper sx={{ width: "100%", maxWidth: 400, p: 4, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          {mode === "login" ? t("loginTitle") : t("registerTitle")}
        </Typography>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: 13 }}>
            {errorMsg}
          </Alert>
        )}

        <Box component="form" action={formAction} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Hidden locale field so the action knows where to redirect */}
          <input type="hidden" name="locale" value={locale} />

          {mode === "register" && (
            <TextField
              name="name"
              label={t("name")}
              required
              fullWidth
              size="small"
              autoComplete="name"
            />
          )}

          <TextField
            name="email"
            label={t("email")}
            type="email"
            required
            fullWidth
            size="small"
            autoComplete="email"
          />

          <TextField
            name="password"
            label={t("password")}
            type="password"
            required
            fullWidth
            size="small"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={pending}
            sx={{ mt: 1, borderRadius: 2, py: 1.2, fontWeight: 600 }}
          >
            {t("submit")}
          </Button>
        </Box>

        <Box sx={{ mt: 2.5, textAlign: "center" }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {mode === "login" ? t("noAccount") : t("hasAccount")}{" "}
          </Typography>
          <Typography
            component={Link}
            href={mode === "login" ? "/register" : "/login"}
            variant="caption"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            {mode === "login" ? t("register") : t("login")}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
