"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";

const LOCALES = [
  { value: "es", label: "ES" },
  { value: "en", label: "EN" },
  { value: "pt", label: "PT" },
];

export default function LanguageSwitcher({ label }: { label: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (_: React.MouseEvent, newLocale: string | null) => {
    if (!newLocale) return;
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 13, color: "#6e6e73" }}>{label}</span>
      <ToggleButtonGroup
        value={locale}
        exclusive
        onChange={handleChange}
        size="small"
        sx={{
          "& .MuiToggleButton-root": {
            border: "1px solid #d1d1d6",
            borderRadius: "8px !important",
            px: 1.5,
            py: 0.5,
            fontSize: 12,
            fontWeight: 500,
            color: "#6e6e73",
            "&.Mui-selected": {
              backgroundColor: "#1c1c1e",
              color: "#ffffff",
              "&:hover": { backgroundColor: "#1c1c1e" },
            },
          },
        }}
      >
        {LOCALES.map((l) => (
          <ToggleButton key={l.value} value={l.value}>
            {l.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
}
