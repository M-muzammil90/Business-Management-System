"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", organizationName: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to create account.");
      router.push("/auth/login");
    } catch (registerError) { setError(registerError instanceof Error ? registerError.message : "Unable to create account."); }
    finally { setLoading(false); }
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#f7f4ee] px-6 py-12 text-[#25231f]"><div className="w-full max-w-md"><Link href="/" className="font-serif text-3xl tracking-[-0.06em]">morrow.</Link><div className="mt-14"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b45d43]">Get started</p><h1 className="mt-3 font-serif text-5xl tracking-[-0.06em]">Create your workspace.</h1><p className="mt-4 text-sm leading-6 text-[#625e56]">Set up your organization to start managing live business data.</p><form onSubmit={handleSubmit} className="mt-8 space-y-4"><input required placeholder="Your name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="h-11 w-full rounded-lg border border-[#25231f]/20 bg-transparent px-3 text-sm outline-none focus:border-[#b45d43]" /><input required type="email" placeholder="Work email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="h-11 w-full rounded-lg border border-[#25231f]/20 bg-transparent px-3 text-sm outline-none focus:border-[#b45d43]" /><input required placeholder="Organization name" value={form.organizationName} onChange={(event) => setForm({ ...form, organizationName: event.target.value })} className="h-11 w-full rounded-lg border border-[#25231f]/20 bg-transparent px-3 text-sm outline-none focus:border-[#b45d43]" /><input required minLength={6} type="password" placeholder="Password (6+ characters)" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="h-11 w-full rounded-lg border border-[#25231f]/20 bg-transparent px-3 text-sm outline-none focus:border-[#b45d43]" />{error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#25231f] text-sm font-semibold text-white hover:bg-[#b45d43] disabled:opacity-60">{loading ? "Creating..." : "Create workspace"}<ArrowRight className="h-4 w-4" /></button></form><p className="mt-8 text-center text-sm text-[#625e56]">Already have an account? <Link href="/auth/login" className="font-semibold text-[#b45d43]">Sign in</Link></p></div></div></main>;
}
