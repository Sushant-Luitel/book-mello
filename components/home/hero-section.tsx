"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Truck, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAF8F5] dark:bg-[#141312] border-b border-border/50 transition-colors">
      {/* Background Silk Texture & Ambient Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/hero-silk-bg.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-65 mix-blend-multiply dark:opacity-10 dark:mix-blend-screen select-none"
        />
        {/* Soft Radial Gradients for Lighting Depth */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#1F64AF]/10 dark:bg-[#1F64AF]/15 blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 w-[500px] h-[500px] rounded-full bg-[#E5A116]/12 dark:bg-[#E5A116]/10 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-18 pb-14 sm:pb-18">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Content Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 md:space-y-7 max-w-2xl lg:max-w-none">
            
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#1F64AF]/10 dark:bg-[#1F64AF]/20 border border-[#1F64AF]/25 text-[#1F64AF] dark:text-blue-300 text-xs sm:text-sm font-semibold tracking-wide shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#E5A116] fill-[#E5A116]" />
              <span>Nepal&apos;s Independent Online Bookstore</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[60px] font-black tracking-tight text-[#1F64AF] dark:text-[#5295DF] uppercase leading-[1.08] text-balance">
                Connecting Pages <br className="hidden sm:inline" />
                <span className="text-[#1F64AF] dark:text-[#5295DF]">With People</span>
              </h1>
              <p className="font-serif italic text-xl sm:text-2xl md:text-[25px] text-foreground/90 font-medium tracking-tight">
                Your Next Read, Delivered Across Nepal
              </p>
              <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xl leading-relaxed pt-1">
                Handpicked fiction, personal development, literary classics, and trending paperbacks delivered straight to your home with guaranteed doorstep cash on delivery.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <Button
                size="lg"
                className="h-12 px-8 rounded-full bg-[#E5A116] hover:bg-[#D08F0E] text-slate-950 font-bold shadow-md shadow-[#E5A116]/25 hover:shadow-lg hover:shadow-[#E5A116]/35 transition-all text-base tracking-wide"
                asChild
              >
                <Link href="/shop" className="flex items-center justify-center gap-2">
                  <span>ORDER NOW</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-12 px-7 rounded-full border-2 border-foreground/20 hover:border-foreground/40 text-foreground font-semibold hover:bg-foreground/5 transition-all text-base"
                asChild
              >
                <Link href="/shop" className="flex items-center justify-center">
                  Browse Catalog
                </Link>
              </Button>
            </div>

            {/* Quick Trust Highlights */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1 text-xs sm:text-sm text-foreground/80 font-medium">
              <span className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-[#1F64AF]" />
                Delivery to all 7 Provinces
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#E5A116]" />
                100% Genuine Books
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Cash On Delivery
              </span>
            </div>

            {/* Contact & Social Bar */}
            <div className="pt-4 border-t border-border/60 flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground mr-1">
                Direct Contact:
              </span>

              {/* WhatsApp Pill */}
              <a
                href="https://wa.me/9779717028478?text=Hi%20BookMello,%20I%20would%20like%20to%20order%20a%20book!"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact BookMello on WhatsApp"
                className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-card border border-emerald-500/40 hover:border-emerald-500 shadow-xs hover:shadow-sm text-foreground text-xs sm:text-sm font-semibold transition-all hover:-translate-y-0.5"
              >
                <div className="w-5 h-5 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.287.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.087-.179.182-.077.357.101.174.453.748.973 1.212.671.597 1.238.783 1.412.87.174.087.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.232-.144.39-.087s1.011.477 1.184.564.289.13.332.203c.044.072.044.419-.1 1.024z"/>
                  </svg>
                </div>
                <span>9717028478</span>
              </a>

              {/* Instagram Pill */}
              <a
                href="https://instagram.com/shopbookmello"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="BookMello Instagram"
                className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-card border border-pink-500/35 hover:border-pink-500 shadow-xs hover:shadow-sm text-foreground text-xs sm:text-sm font-semibold transition-all hover:-translate-y-0.5"
              >
                <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shrink-0">
                  <svg className="w-3.5 h-3.5 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                  </svg>
                </div>
                <span>@shopbookmello</span>
              </a>

              {/* TikTok Pill */}
              <a
                href="https://tiktok.com/@shopbookmello"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="BookMello TikTok"
                className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-card border border-foreground/20 hover:border-foreground/50 shadow-xs hover:shadow-sm text-foreground text-xs sm:text-sm font-semibold transition-all hover:-translate-y-0.5"
              >
                <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-white shrink-0">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .59.043.87.126V9.41a6.33 6.33 0 0 0-.87-.06A6.34 6.34 0 0 0 3 15.69a6.34 6.34 0 0 0 10.82 4.48c.32-.32.6-.68.83-1.07.2-.34.34-.7.42-1.08V9.38a8.16 8.16 0 0 0 4.52 1.36V7.32a4.85 4.85 0 0 1 0-.63z"/>
                  </svg>
                </div>
                <span>@shopbookmello</span>
              </a>
            </div>

          </div>

          {/* Right Column - Polaroid Composition Showcase (5 cols) */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end relative py-6 lg:py-2">
            <div className="relative w-full max-w-[420px] sm:max-w-[460px] h-[380px] sm:h-[440px] flex items-center justify-center">
              
              {/* Decorative Accent Strips (Behind photos) */}
              <div 
                className="absolute top-4 right-10 w-28 h-7 bg-[#E5A116] rounded-xs shadow-md transform rotate-12 -z-0" 
                aria-hidden="true" 
              />
              <div 
                className="absolute bottom-6 left-12 w-32 h-6 bg-[#1F64AF] rounded-xs shadow-md transform -rotate-6 -z-0" 
                aria-hidden="true" 
              />

              {/* Polaroid 1: Picnic Book Flatlay (Tilted Left) */}
              <div className="absolute left-2 sm:left-4 top-4 w-[210px] sm:w-[250px] bg-white dark:bg-zinc-900 p-2.5 pb-6 sm:pb-7 rounded-sm shadow-2xl ring-1 ring-black/10 transform -rotate-6 hover:-rotate-1 hover:scale-105 transition-all duration-300 z-10">
                <div className="relative aspect-square w-full overflow-hidden rounded-xs bg-muted">
                  <Image
                    src="/hero-picnic.jpg"
                    alt="Cozy book picnic flatlay"
                    fill
                    sizes="(max-width: 768px) 240px, 260px"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="pt-3 px-1 text-center font-serif text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 italic">
                  Aesthetic Bookish Reads ✨
                </div>
              </div>

              {/* Polaroid 2: Outdoor Reader (Tilted Right, Overlapping) */}
              <div className="absolute right-2 sm:right-4 bottom-4 w-[210px] sm:w-[250px] bg-white dark:bg-zinc-900 p-2.5 pb-6 sm:pb-7 rounded-sm shadow-2xl ring-1 ring-black/10 transform rotate-6 hover:rotate-1 hover:scale-105 transition-all duration-300 z-20">
                <div className="relative aspect-square w-full overflow-hidden rounded-xs bg-muted">
                  <Image
                    src="/hero-reader.jpg"
                    alt="Girl reading book outdoors in sunlight"
                    fill
                    sizes="(max-width: 768px) 240px, 260px"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="pt-3 px-1 text-center font-serif text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 italic">
                  Lost in Another World 📖
                </div>
              </div>

              {/* Overlapping "Cash On Delivery" Guarantee Stamp Badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 transform -rotate-12 hover:rotate-0 transition-transform duration-300 pointer-events-none">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#FAF8F5] dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 p-2 shadow-xl ring-2 ring-zinc-300 dark:ring-zinc-600 flex flex-col items-center justify-center text-center border-4 border-dashed border-zinc-400 dark:border-zinc-500">
                  <span className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
                    ★ Nepal ★
                  </span>
                  <span className="font-black text-xs sm:text-sm uppercase leading-tight tracking-tight text-zinc-900 dark:text-white my-0.5">
                    Cash On<br />Delivery
                  </span>
                  <span className="text-[9px] font-semibold text-[#1F64AF] dark:text-blue-400">
                    Pay at Doorstep
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
