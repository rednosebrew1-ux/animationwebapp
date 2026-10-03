import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Animation Web App",
  description: "Remotion-powered video renderer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
