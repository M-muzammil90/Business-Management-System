"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok || !result.success || !result.data?.token) {
        throw new Error(result.message || "Unable to sign in.");
      }
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));
      router.push("/dashboard");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-[#f7f4ee] text-[#25231f] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden min-h-screen bg-[#25231f] p-10 text-[#f7f4ee] lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="font-serif text-3xl tracking-[-0.06em]">morrow.</Link>
        <div className="max-w-lg"><p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#d9a083]">Your business, in focus</p><h1 className="font-serif text-7xl leading-[0.9] tracking-[-0.06em]">Good decisions start with good visibility.</h1><p className="mt-7 max-w-sm text-sm leading-6 text-white/60">Manage products, orders, customers and stock from one calm, connected workspace.</p></div>
        <p className="text-xs uppercase tracking-[0.16em] text-white/40">Secure workspace access</p>
      </section>
      <section className="flex items-center justify-center px-6 py-12 sm:px-10"><div className="w-full max-w-md"><Link href="/" className="font-serif text-3xl tracking-[-0.06em] lg:hidden">morrow.</Link><div className="mt-16 lg:mt-0"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b45d43]">Welcome back</p><h2 className="mt-3 font-serif text-5xl tracking-[-0.06em]">Sign in to your workspace.</h2><p className="mt-4 text-sm leading-6 text-[#625e56]">Use your account to access live business data and controls.</p><form onSubmit={handleSubmit} className="mt-10 space-y-5"><label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em]">Email</span><div className="relative"><Mail className="absolute left-3 top-3 h-4 w-4 text-[#777269]" /><input required type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="h-11 w-full rounded-lg border border-[#25231f]/20 bg-transparent pl-10 pr-3 text-sm outline-none focus:border-[#b45d43]" placeholder="you@company.com" /></div></label><label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em]">Password</span><div className="relative"><LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-[#777269]" /><input required type="password" autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="h-11 w-full rounded-lg border border-[#25231f]/20 bg-transparent pl-10 pr-3 text-sm outline-none focus:border-[#b45d43]" placeholder="Enter your password" /></div></label>{error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={loading} type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#25231f] text-sm font-semibold text-white transition hover:bg-[#b45d43] disabled:opacity-60">{loading ? "Signing in..." : "Sign in"}<ArrowRight className="h-4 w-4" /></button></form><p className="mt-8 text-center text-sm text-[#625e56]">New here? <Link href="/auth/register" className="font-semibold text-[#b45d43]">Create an account</Link></p></div></div></section>
    </main>
  );
}
