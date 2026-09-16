"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Heart, Search, ShoppingBag, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import StoreNavbar from "@/components/store/StoreNavbar";
import StoreFooter from "@/components/store/StoreFooter";

const slides = [
  { eyebrow: "The new everyday edit", title: "Objects with a little more soul.", copy: "Thoughtful homeware, considered clothing and small luxuries for the everyday.", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1800&q=85" },
  { eyebrow: "Soft utility", title: "Make room for better things.", copy: "A warm, tactile collection designed to bring calm and character to your space.", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1800&q=85" },
  { eyebrow: "Made to be kept", title: "The details make the day.", copy: "Discover pieces that earn their place, from first coffee to last light.", image: "https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d?auto=format&fit=crop&w=1800&q=85" },
];

const fallbackCategories = [
  { name: "Home", detail: "Quiet essentials", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80" },
  { name: "Wardrobe", detail: "Everyday layers", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80" },
  { name: "Wellness", detail: "Slow rituals", image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80" },
  { name: "Gifts", detail: "Small joys", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80" },
];

const fallbackProducts = [
  { name: "Linen House Shirt", category: "Wardrobe", price: "$98", oldPrice: "$125", tag: "Best seller", image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&q=85" },
  { name: "Cedar & Fig Candle", category: "Wellness", price: "$32", oldPrice: "", tag: "New in", image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=85" },
  { name: "Arc Ceramic Vase", category: "Home", price: "$64", oldPrice: "", tag: "Editor pick", image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=900&q=85" },
  { name: "Oat Knit Throw", category: "Home", price: "$120", oldPrice: "$150", tag: "-20%", image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=85" },
];

interface StoreCategory {
  _id: string;
  name: string;
  description?: string;
}

interface StoreProduct {
  _id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  categoryId?: { name?: string } | null;
}

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [catalogCategories, setCatalogCategories] = useState<StoreCategory[]>([]);
  const [catalogProducts, setCatalogProducts] = useState<StoreProduct[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const slide = slides[activeSlide];

  useEffect(() => {
    async function fetchCatalog() {
      const token = localStorage.getItem("token");
      if (!token) {
        setCatalogLoading(false);
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [categoriesResponse, productsResponse] = await Promise.all([
          fetch("/api/categories?page=1&limit=8", { headers, cache: "no-store" }),
          fetch("/api/products?page=1&limit=12", { headers, cache: "no-store" }),
        ]);
        const categoriesResult = await categoriesResponse.json();
        const productsResult = await productsResponse.json();

        if (categoriesResponse.ok && categoriesResult.success) {
          setCatalogCategories(categoriesResult.data?.categories || []);
        }
        if (productsResponse.ok && productsResult.success) {
          setCatalogProducts(productsResult.data?.products || []);
        }
      } finally {
        setCatalogLoading(false);
      }
    }

    fetchCatalog();
  }, []);

  const visibleCategories = catalogCategories.length
    ? catalogCategories.map((category, index) => ({
        name: category.name,
        detail: category.description || "Explore collection",
        image: fallbackCategories[index % fallbackCategories.length].image,
      }))
    : fallbackCategories;

  const visibleProducts = catalogProducts.length
    ? catalogProducts.map((product, index) => ({
        name: product.name,
        category: product.categoryId?.name || "Collection",
        price: `Rs. ${product.price.toLocaleString("en-PK")}`,
        oldPrice: "",
        tag: product.stock > 0 ? "Available" : "Out of stock",
        image: product.image || fallbackProducts[index % fallbackProducts.length].image,
      }))
    : fallbackProducts;

  useEffect(() => {
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % slides.length), 5500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="home-page min-h-screen overflow-hidden bg-[#f7f4ee] text-[#25231f]">
      <div className="bg-[#25231f] px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f7f4ee] sm:text-xs">Complimentary delivery on orders over $75</div>
      <StoreNavbar />

      <section className="relative mx-auto max-w-[1440px] px-5 pt-5 sm:px-8 lg:px-12 lg:pt-8"><div className="relative min-h-[590px] overflow-hidden sm:min-h-[680px] lg:min-h-[700px]"><img src={slide.image} alt="Morrow collection" className="absolute inset-0 h-full w-full object-cover transition duration-700" /><div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent" /><div className="relative flex min-h-[590px] max-w-xl flex-col justify-end p-7 pb-20 text-white sm:min-h-[680px] sm:p-12 sm:pb-24 lg:min-h-[700px] lg:p-20"><p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/80">{slide.eyebrow}</p><h1 className="max-w-2xl font-serif text-5xl leading-[0.92] tracking-[-0.06em] sm:text-7xl lg:text-[92px]">{slide.title}</h1><p className="mt-6 max-w-sm text-sm leading-6 text-white/85 sm:text-base">{slide.copy}</p><a href="#shop" className="mt-8 flex w-fit items-center gap-3 border-b border-white pb-2 text-xs font-semibold uppercase tracking-[0.2em]">Shop the edit <ArrowRight className="h-4 w-4" /></a></div><div className="absolute bottom-7 right-7 flex items-center gap-3 sm:bottom-10 sm:right-10"><button onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)} aria-label="Previous slide" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/50 text-white hover:bg-white hover:text-[#25231f]"><ChevronLeft className="h-4 w-4" /></button><span className="text-xs font-semibold text-white">0{activeSlide + 1} <span className="mx-1 text-white/50">/</span> 0{slides.length}</span><button onClick={() => setActiveSlide((activeSlide + 1) % slides.length)} aria-label="Next slide" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/50 text-white hover:bg-white hover:text-[#25231f]"><ChevronRight className="h-4 w-4" /></button></div></div></section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28" id="categories"><div className="mb-9 flex items-end justify-between"><div><p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b45d43]">Find your pace</p><h2 className="font-serif text-4xl tracking-[-0.05em]">Shop by feeling.</h2></div><a href="#shop" className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] sm:flex">View all <ArrowRight className="h-4 w-4" /></a></div>{catalogLoading ? <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">{[1, 2, 3, 4].map((item) => <div key={item} className="aspect-[0.82] animate-pulse bg-[#e5dfd5]" />)}</div> : <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">{visibleCategories.map((category) => <a href="#shop" key={category.name} className="group relative aspect-[0.82] overflow-hidden bg-[#e5dfd5]"><img src={category.image} alt={category.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5 pt-20 text-white"><p className="font-serif text-2xl tracking-[-0.04em]">{category.name}</p><p className="mt-1 line-clamp-1 text-[10px] uppercase tracking-[0.18em] text-white/75">{category.detail}</p></div></a>)}</div>}</section>

      <section id="shop" className="bg-[#e7e1d7] px-5 py-20 sm:px-8 lg:px-12 lg:py-28"><div className="mx-auto max-w-[1440px]"><div className="mb-10 flex items-end justify-between"><div><p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b45d43]">Considered essentials</p><h2 className="font-serif text-4xl tracking-[-0.05em] sm:text-5xl">The good stuff.</h2></div><button className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] sm:flex">Explore all <ArrowRight className="h-4 w-4" /></button></div>{catalogLoading ? <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">{[1, 2, 3, 4].map((item) => <div key={item} className="aspect-[0.82] animate-pulse bg-[#f2eee8]" />)}</div> : <div className="grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-4 lg:gap-6">{visibleProducts.map((product) => <article key={product.name} className="group"><div className="relative aspect-[0.82] overflow-hidden bg-[#f2eee8]"><img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /><span className="absolute left-3 top-3 bg-[#f7f4ee] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em]">{product.tag}</span><button aria-label={`Save ${product.name}`} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#f7f4ee]/90"><Heart className="h-4 w-4" strokeWidth={1.6} /></button><button disabled={product.tag === "Out of stock"} onClick={() => setCartCount((count) => count + 1)} className="absolute inset-x-3 bottom-3 translate-y-14 bg-[#25231f] py-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-white transition group-hover:translate-y-0 disabled:cursor-not-allowed disabled:bg-[#777269]">{product.tag === "Out of stock" ? "Out of stock" : "Add to bag"}</button></div><div className="pt-4"><p className="text-[10px] uppercase tracking-[0.15em] text-[#777269]">{product.category}</p><h3 className="mt-1 font-serif text-xl tracking-[-0.03em]">{product.name}</h3><p className="mt-2 text-sm">{product.price}</p></div></article>)}</div>}</div></section>

      <section id="story" className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-24 lg:px-12 lg:py-32"><div className="relative aspect-[0.9] overflow-hidden bg-[#d4c8b8]"><img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1300&q=85" alt="Warm, considered interiors" className="h-full w-full object-cover" /><div className="absolute bottom-5 left-5 flex items-center gap-2 bg-[#f7f4ee] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em]"><Sparkles className="h-3.5 w-3.5 text-[#b45d43]" /> Made for slower living</div></div><div className="max-w-md"><p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b45d43]">A little about us</p><h2 className="font-serif text-5xl leading-[0.95] tracking-[-0.06em] sm:text-6xl">Less noise.<br />More meaning.</h2><p className="mt-7 text-base leading-7 text-[#625e56]">Morrow is a collection of things that feel good to live with. We look for honest materials, useful beauty and makers who care about the details as much as we do.</p><a href="#journal" className="mt-8 inline-flex items-center gap-3 border-b border-[#25231f] pb-2 text-xs font-semibold uppercase tracking-[0.19em]">Read our story <ArrowRight className="h-4 w-4" /></a></div></section>

      <section id="journal" className="border-y border-[#25231f]/10 bg-[#f0ece5] px-5 py-16 sm:px-8 lg:px-12 lg:py-20"><div className="mx-auto grid max-w-[1440px] items-center gap-8 lg:grid-cols-[1fr_1.2fr]"><div><p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b45d43]">The Morrow note</p><h2 className="font-serif text-4xl tracking-[-0.05em]">Good things, occasionally.</h2><p className="mt-4 max-w-sm text-sm leading-6 text-[#625e56]">New collections, studio visits and thoughtful notes, sent with care.</p></div><div className="flex flex-col gap-3 sm:flex-row"><input type="email" placeholder="Your email address" className="h-12 min-w-0 flex-1 border-b border-[#25231f]/30 bg-transparent px-1 text-sm outline-none placeholder:text-[#777269]" /><button className="h-12 bg-[#25231f] px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">Subscribe</button></div></div></section>

      <footer className="bg-[#25231f] px-5 py-12 text-[#f7f4ee] sm:px-8 lg:px-12"><div className="mx-auto max-w-[1440px]"><div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]"><div><p className="font-serif text-3xl tracking-[-0.06em]">morrow.</p><p className="mt-4 max-w-xs text-sm leading-6 text-white/60">Everyday objects for a life well lived.</p></div><div><p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">Explore</p><div className="flex flex-col gap-3 text-sm text-white/80"><a href="#shop">Shop all</a><a href="#categories">Collections</a><a href="#story">Our story</a></div></div><div><p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">Help</p><div className="flex flex-col gap-3 text-sm text-white/80"><a href="/marketing/contact">Contact</a><a href="#journal">Shipping & returns</a><a href="/auth/login">Account</a></div></div><div><p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">Follow along</p><div className="flex gap-3 text-sm text-white/80"><a href="#journal">Instagram</a><a href="#journal">Pinterest</a></div></div></div><div className="mt-14 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 text-[10px] uppercase tracking-[0.12em] text-white/40 sm:flex-row"><p>© 2026 Morrow Studio</p><p>Thoughtfully made, wherever you are.</p></div></div></footer>
      <StoreFooter />
    </main>
  );
}
