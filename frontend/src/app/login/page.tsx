"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

export default function LoginPage() {
  const router = useRouter();
  const { usuario, setUsuario } = useAuth();

  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarPass, setMostrarPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Si ya hay sesión, redirige al menú principal
  useEffect(() => {
    if (usuario) router.push("/");
  }, [usuario]);

  // Captura el Enter en el formulario y llama a la función de login
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleLogin();
  }

  async function handleLogin() {
    setError(null);
    if (!nombreUsuario.trim() || !contrasena.trim()) {
      setError("Completá todos los campos.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombreUsuario: nombreUsuario.trim(), contrasena }),
      });
      if (res.status === 401) {
        setError("Usuario o contraseña incorrectos.");
        return;
      }
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setUsuario(data);            // guarda en contexto y localStorage
      router.push("/");            // redirige al menú principal
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d0f14; color: #e2e8f0; font-family: 'IBM Plex Sans', sans-serif; min-height: 100vh; }
        .shell { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }

        .login-card {
          background: #111318;
          border: 1px solid #1e2330;
          border-radius: 12px;
          padding: 2.5rem 2rem;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 0 40px rgba(0,0,0,0.6);
        }
        .login-logo {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          color: #4ade80;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border: 1px solid #4ade8040;
          padding: 4px 10px;
          border-radius: 4px;
          display: inline-block;
          margin-bottom: 1.5rem;
        }
        .login-title { font-size: 1.4rem; font-weight: 600; color: #f1f5f9; margin-bottom: 0.3rem; }
        .login-sub { font-size: 0.8rem; color: #64748b; margin-bottom: 2rem; font-weight: 300; }

        .field { margin-bottom: 1.25rem; }
        label { font-size: 0.75rem; font-weight: 500; color: #94a3b8; margin-bottom: 0.35rem; display: block; }
        .input-wrap { position: relative; }
        input {
          width: 100%;
          background: #0d0f14;
          border: 1px solid #1e2330;
          color: #e2e8f0;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 0.85rem;
          padding: 0.6rem 0.85rem;
          border-radius: 6px;
          outline: none;
          transition: border-color 0.2s;
        }
        input:focus { border-color: #4ade8060; box-shadow: 0 0 0 3px #4ade8012; }
        .toggle-pass {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #475569;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
        }
        .toggle-pass:hover { color: #94a3b8; }

        .btn-login {
          width: 100%;
          background: #4ade80;
          color: #0a0f0d;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.65rem;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          transition: background 0.15s, box-shadow 0.15s, transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }
        .btn-login:hover:not(:disabled) {
          background: #86efac;
          box-shadow: 0 0 20px #4ade8040;
          transform: translateY(-1px);
        }
        .btn-login:disabled { opacity: 0.5; cursor: not-allowed; }

        .error-msg {
          background: #2d1215;
          border: 1px solid #7f1d1d40;
          color: #f87171;
          font-size: 0.78rem;
          padding: 0.65rem 0.9rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div className="shell">
        <div className="login-card">
          <span className="login-logo">SisLic · Admin</span>
          <h1 className="login-title">Iniciar sesión</h1>
          <p className="login-sub">Solo usuarios administrativos autorizados.</p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="error-msg">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                {error}
              </div>
            )}

            <div className="field">
              <label>Nombre de usuario</label>
              <input
                type="text"
                placeholder="usuario"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value.toLowerCase().replace(/\s/g, ""))}
                autoComplete="username"
              />
            </div>

            <div className="field">
              <label>Contraseña</label>
              <div className="input-wrap">
                <input
                  type={mostrarPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  style={{ paddingRight: "2.5rem" }}
                  autoComplete="current-password"
                />
                <button className="toggle-pass" onClick={() => setMostrarPass(!mostrarPass)} type="button">
                  {mostrarPass ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <button className="btn-login" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ animation: "spin 1s linear infinite" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  Ingresando...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}