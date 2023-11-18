import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat Prototype",
  description: "Nextjs, Sqlite, socket.io prototype",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html id="root" lang="en">
      <body>{children}</body>
    </html>
  );
}
