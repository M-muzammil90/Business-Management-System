"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

const links = [
  ["Shop", "/shop"],
  ["Collections", "/collections"],
  ["Our story", "/story"],
  ["Journal", "/journal"],
] as const;

export default function StoreNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="relative z-30 border-b border-[#25231f]/10 bg-[#f7f4ee]/95 backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <button className="lg:hidden" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu className="h-5 w-5" /></button>
          <Link href="/" className="font-serif text-2xl font-semibold tracking-[-0.06em] sm:text-3xl">morrow.</Link>
          <nav className="hidden items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.18em] lg:flex">
            {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </nav>
          <div className="flex items-center gap-4">
            <button aria-label="Search" onClick={() => setSearchOpen((open) => !open)}><Search className="h-[18px] w-[18px]" strokeWidth={1.8} /></button>
            <Link href="/auth/login" className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] sm:block">Login</Link>
            <Link href="/auth/register" className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] sm:block">Register</Link>
            <button aria-label="Shopping bag"><ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.8} /></button>
          </div>
        </div>
        {searchOpen && <div className="border-t border-[#25231f]/10 px-5 py-4 sm:px-8 lg:px-12"><div className="mx-auto flex max-w-[1440px] items-center gap-3"><Search className="h-4 w-4 text-[#777269]" /><input autoFocus placeholder="Search the collection" className="w-full bg-transparent text-sm outline-none placeholder:text-[#777269]" /><button aria-label="Close search" onClick={() => setSearchOpen(false)}><X className="h-4 w-4" /></button></div></div>}
      </header>
      {menuOpen && <div className="fixed inset-0 z-50 bg-[#f7f4ee] p-6 lg:hidden"><div className="flex items-center justify-between"><Link href="/" className="font-serif text-2xl font-semibold">morrow.</Link><button aria-label="Close menu" onClick={() => setMenuOpen(false)}><X /></button></div><nav className="mt-20 flex flex-col gap-7 font-serif text-4xl">{links.map(([label, href]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>)}<div className="mt-5 flex gap-5 border-t border-[#25231f]/10 pt-7 font-sans text-sm font-semibold uppercase tracking-[0.16em]"><Link href="/auth/login" onClick={() => setMenuOpen(false)}>Login</Link><Link href="/auth/register" onClick={() => setMenuOpen(false)}>Register</Link></div></nav></div>}
    </>
  );
}
