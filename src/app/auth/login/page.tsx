"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-surface-soft)] px-4">
      <div className="w-full max-w-md">
        <div className="min-w-[500px] bg-white rounded-lg border border-[var(--color-border-subtle)] p-8 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Database className="w-8 h-8 text-[var(--color-brand-primary)]" />
            <span className="text-2xl font-bold text-[var(--color-text-primary)]">
              Zhiten
            </span>
          </div>

          <h1 className="text-[20px] font-bold text-[var(--color-text-primary)] mb-2 text-center">
            Sign in to your account
          </h1>
          <p className="text-[14px] text-[var(--color-text-muted)] mb-6 text-center">
            Enter your credentials to access the data portal
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-[14px] text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-[14px]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-[14px]">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] hover:opacity-90"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-[14px] text-[var(--color-text-muted)]">
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="text-[var(--color-brand-primary)] hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
