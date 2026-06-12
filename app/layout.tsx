import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simulacro",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
