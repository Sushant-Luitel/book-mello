"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-linear-to-br from-[#FAF8F5] via-[#F4EFE6] to-[#FAF8F5] dark:from-[#141312] dark:via-[#1a1f2e] dark:to-[#1c1710] border-b border-border/50 transition-colors">
      {/* Soft ambient blobs for depth with floating animation */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-brand-blue/10 dark:bg-brand-blue/15 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-16 right-1/3 w-96 h-96 rounded-full bg-brand-gold/10 dark:bg-brand-gold/10 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/3 right-0 w-64 h-64 rounded-full bg-brand-blue/8 dark:bg-brand-blue/8 blur-3xl"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-18 pb-14 sm:pb-18">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Content Column (7 cols) */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="lg:col-span-7 flex flex-col justify-center space-y-6 md:space-y-7 max-w-2xl lg:max-w-none"
          >
            {/* Tag / Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 border border-brand-blue/25 text-brand-blue dark:text-blue-300 text-xs sm:text-sm font-semibold tracking-wide shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />
              <span>Nepal&apos;s Independent Online Bookstore</span>
            </motion.div>

            {/* Main Headline */}
            <motion.div variants={fadeInUp} className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold tracking-tight text-foreground leading-[1.1] text-balance">
                Connecting <span className="font-serif font-medium italic text-brand-blue dark:text-[#5295DF]">Pages</span> <br className="hidden sm:inline" />
                <span className="relative inline-block mt-1">
                  With People
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                    className="absolute bottom-1 left-0 h-3.5 bg-brand-gold/30 dark:bg-brand-gold/40 -z-10 rounded-sm"
                  />
                </span>
              </h1>
              <p className="font-serif italic text-xl sm:text-2xl md:text-[25px] text-foreground/80 font-medium tracking-tight">
                Your Next Read, Delivered Across Nepal
              </p>
              <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xl leading-relaxed pt-1">
                Handpicked fiction, personal development, literary classics, and
                trending paperbacks delivered straight to your home with
                guaranteed doorstep cash on delivery.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <Button
                size="lg"
                className="h-12 px-8 rounded-full bg-brand-gold hover:bg-[#D08F0E] text-slate-950 font-bold shadow-md shadow-brand-gold/25 hover:shadow-lg hover:shadow-brand-gold/35 transition-all text-base tracking-wide relative overflow-hidden group"
                asChild
              >
                <Link
                  href="/all"
                  className="flex items-center justify-center gap-2"
                >
                  <span className="relative z-10">ORDER NOW</span>
                  <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-12 px-7 rounded-full border-2 border-foreground/20 hover:border-foreground/40 text-foreground font-semibold hover:bg-foreground/5 transition-all text-base"
                asChild
              >
                <Link href="/all" className="flex items-center justify-center">
                  Browse Catalog
                </Link>
              </Button>
            </motion.div>

            {/* Quick Trust Highlights */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1 text-xs sm:text-sm text-foreground/80 font-medium">
              <span className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-brand-blue" />
                Delivery to all 7 Provinces
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-brand-gold" />
                100% Genuine Books
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Cash On Delivery
              </span>
            </motion.div>

            {/* Contact & Social Bar */}
            <motion.div variants={fadeInUp} className="pt-4 border-t border-border/60 flex flex-wrap items-center gap-3 sm:gap-4">
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
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.287.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.087-.179.182-.077.357.101.174.453.748.973 1.212.671.597 1.238.783 1.412.87.174.087.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.232-.144.39-.087s1.011.477 1.184.564.289.13.332.203c.044.072.044.419-.1 1.024z" />
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
                <div className="w-5 h-5 rounded-md bg-linear-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shrink-0">
                  <svg
                    className="w-3.5 h-3.5 stroke-current fill-none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
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
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .59.043.87.126V9.41a6.33 6.33 0 0 0-.87-.06A6.34 6.34 0 0 0 3 15.69a6.34 6.34 0 0 0 10.82 4.48c.32-.32.6-.68.83-1.07.2-.34.34-.7.42-1.08V9.38a8.16 8.16 0 0 0 4.52 1.36V7.32a4.85 4.85 0 0 1 0-.63z" />
                  </svg>
                </div>
                <span>@shopbookmello</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column – Banner Image Showcase (5 cols) */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end relative py-6 lg:py-2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4, delay: 0.2 }}
              className="relative w-full max-w-105 sm:max-w-120"
            >
              {/* Decorative Accent Strips */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "7rem" }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -top-3 -right-2 h-7 bg-brand-gold rounded-sm shadow-md transform rotate-12 z-0"
                aria-hidden="true"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "8rem" }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="absolute -bottom-3 -left-2 h-6 bg-brand-blue rounded-sm shadow-md transform -rotate-6 z-0"
                aria-hidden="true"
              />

              {/* Banner Image Card */}
              <motion.div 
                whileHover={{ scale: 1.03, rotate: 0 }}
                className="relative w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10 transform rotate-1 transition-all duration-300 z-10"
              >
                <Image
                  src="/hero-banner.jpg"
                  alt="BookMello – Connecting Pages With People, your next read delivered across Nepal"
                  width={960}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />
              </motion.div>
              {/* Cash On Delivery Stamp Badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 12 }}
                whileHover={{ rotate: 0, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10, delay: 1 }}
                className="absolute -bottom-4 -right-4 z-20 cursor-pointer"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white text-zinc-800 p-2 shadow-xl ring-2 ring-zinc-200 flex flex-col items-center justify-center text-center border-4 border-dashed border-zinc-300">
                  <span className="text-[8px] uppercase tracking-widest font-bold text-zinc-400">
                    ★ Nepal ★
                  </span>
                  <span className="font-black text-xs sm:text-sm uppercase leading-tight tracking-tight text-zinc-900 my-0.5">
                    Cash On
                    <br />
                    Delivery
                  </span>
                  <span className="text-[8px] font-semibold text-brand-blue">
                    Pay at Doorstep
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
