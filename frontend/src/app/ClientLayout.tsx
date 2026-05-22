"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { usuario, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [hoverLogout, setHoverLogout] = useState(false);

  useEffect(() => {
    if (!usuario && pathname !== "/login") {
      router.push("/login");
    }
  }, [usuario, pathname]);

  if (!usuario && pathname === "/login") return <>{children}</>;
  if (!usuario) return null;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{
        background: "#111318",
        borderBottom: "1px solid #1e2330",
        padding: "0 2rem",
        height: "56px",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}>
        <Link href="/" style={{
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: "0.75rem",
          color: "#4ade80",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          border: "1px solid #4ade8040",
          padding: "4px 10px",
          borderRadius: "4px",
          textDecoration: "none",
        }}>
          SisLic · Admin
        </Link>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
          {usuario?.nombre} {usuario?.apellido}
        </span>
        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          onMouseEnter={() => setHoverLogout(true)}
          onMouseLeave={() => setHoverLogout(false)}
          style={{
            background: "transparent",
            border: `1px solid ${hoverLogout ? "#f87171" : "#1e2330"}`,
            color: hoverLogout ? "#f87171" : "#64748b",
            padding: "4px 12px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "0.75rem",
            fontFamily: "IBM Plex Sans, sans-serif",
            transition: "border-color 0.15s, color 0.15s",
          }}
        >
          Cerrar sesión
        </button>
      </header>
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}