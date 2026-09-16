import Link from "next/link";

export default function StoreFooter() {
  return (
    <footer className="bg-[#25231f] px-5 py-12 text-[#f7f4ee] sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1440px] gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="font-serif text-3xl tracking-[-0.06em]">morrow.</Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/60">Everyday objects for a life well lived.</p>
        </div>
        <div><p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">Explore</p><div className="flex flex-col gap-3 text-sm text-white/80"><Link href="/shop">Shop all</Link><Link href="/collections">Collections</Link><Link href="/story">Our story</Link></div></div>
        <div><p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">Help</p><div className="flex flex-col gap-3 text-sm text-white/80"><Link href="/marketing/contact">Contact</Link><Link href="/journal">Journal</Link><Link href="/auth/login">Account</Link></div></div>
        <div><p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">Stay close</p><p className="text-sm leading-6 text-white/60">New collections and thoughtful notes, sent occasionally.</p><Link href="/journal" className="mt-4 inline-block border-b border-white/50 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em]">Join the note</Link></div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[1440px] flex-col justify-between gap-3 border-t border-white/10 pt-5 text-[10px] uppercase tracking-[0.12em] text-white/40 sm:flex-row"><p>© 2026 Morrow Studio</p><p>Thoughtfully made, wherever you are.</p></div>
    </footer>
  );
}
