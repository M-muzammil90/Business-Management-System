import Link from "next/link";
import StoreFooter from "@/components/store/StoreFooter";
import StoreNavbar from "@/components/store/StoreNavbar";

const collections = [
  ["Home", "Quiet essentials for spaces that feel like you.", "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85"],
  ["Wardrobe", "Everyday layers with room to breathe.", "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85"],
  ["Wellness", "Small rituals for slower mornings and softer evenings.", "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=85"],
  ["Gifts", "Thoughtful gestures, ready to make someone’s day.", "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=85"],
];

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-[#e7e1d7] text-[#25231f]">
      <StoreNavbar />
      <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24"><p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b45d43]">Find your pace</p><h1 className="mt-4 font-serif text-6xl leading-[0.9] tracking-[-0.06em] sm:text-8xl">Shop by<br />feeling.</h1><p className="mt-7 max-w-md text-base leading-7 text-[#625e56]">Four considered worlds, brought together for the way you want to live.</p></section>
      <section className="grid gap-4 px-5 sm:grid-cols-2 sm:px-8 lg:px-12">{collections.map(([name, detail, image], index) => <Link href="/shop" key={name} className="group relative aspect-[1.1] overflow-hidden bg-[#d4c8b8]"><img src={image} alt={name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8"><span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">0{index + 1}</span><h2 className="mt-3 font-serif text-4xl">{name}</h2><p className="mt-2 max-w-xs text-sm leading-5 text-white/80">{detail}</p><span className="mt-5 inline-block border-b border-white pb-1 text-[10px] font-semibold uppercase tracking-[0.18em]">Explore collection</span></div></Link>)}</section>
      <section className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8 lg:py-24"><p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b45d43]">Our edit</p><h2 className="mt-4 font-serif text-4xl sm:text-6xl">Everything has a feeling.</h2><div className="mt-10 grid gap-8 sm:grid-cols-3"><div><h3 className="font-serif text-2xl">Quiet</h3><p className="mt-3 text-sm leading-6 text-[#625e56]">Soft textures and useful shapes for a calmer home.</p></div><div><h3 className="font-serif text-2xl">Useful</h3><p className="mt-3 text-sm leading-6 text-[#625e56]">Pieces that work beautifully in the rhythm of your day.</p></div><div><h3 className="font-serif text-2xl">Lasting</h3><p className="mt-3 text-sm leading-6 text-[#625e56]">Materials and makers selected with tomorrow in mind.</p></div></div></section>
      <section className="mx-auto grid max-w-[1100px] gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-24"><img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85" alt="Natural materials in a warm interior" className="aspect-[1.1] h-full w-full object-cover" /><div><p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b45d43]">A closer look</p><h2 className="mt-4 font-serif text-5xl">Texture makes the room.</h2><p className="mt-5 text-sm leading-6 text-[#625e56]">Natural fibres, gentle colour and shapes that invite a slower pace.</p></div></section>
      <section className="bg-[#b45d43] px-5 py-16 text-center text-[#f7f4ee] sm:px-8"><h2 className="font-serif text-4xl sm:text-5xl">Start with what feels right.</h2><Link href="/shop" className="mt-7 inline-block border-b border-white pb-2 text-xs font-semibold uppercase tracking-[0.18em]">Shop the edit</Link></section>
      <StoreFooter />
    </main>
  );
}
