import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import ClientLayout from "./ClientLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "SisLic",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          background: "#0d0f14",
          color: "#e2e8f0",
          fontFamily: "'IBM Plex Sans', sans-serif",
        }}
      >
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
