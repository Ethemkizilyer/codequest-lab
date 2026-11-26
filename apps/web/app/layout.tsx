import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeQuest Lab",
  description: "Learn full-stack development through practical quests.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
