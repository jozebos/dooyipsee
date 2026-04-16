import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ดูอิปซี — ดูไพ่ยิปซีออนไลน์ ฟรี",
  description: "ดูไพ่ยิปซีออนไลน์ ฟรี",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
