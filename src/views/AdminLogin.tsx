"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Lock, User } from "lucide-react";

const logoImg = "/logo.png";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.auth.login(username, password);
      router.push("/admin/dashboard");
    } catch {
      setError("Invalid credentials or not an admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logoImg} alt="Laptop World" className="h-16 mx-auto mb-4" data-testid="img-admin-logo" />
          <h1 className="font-display text-2xl font-bold text-foreground" data-testid="text-admin-title">Admin Login</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to manage your store</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl bg-card border border-border p-6 shadow-product space-y-4" data-testid="form-admin-login">
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive" data-testid="text-login-error">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                placeholder="Enter username"
                required
                data-testid="input-username"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                placeholder="Enter password"
                required
                data-testid="input-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg gradient-accent py-2.5 font-semibold text-secondary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            data-testid="button-login"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
