"use client";

import Link from "next/link";
import Image from "next/image";
import { Truck, ShieldCheck, Heart, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1C1816] text-[#F3EFEA] mt-auto border-t border-white/10">
      {/* Top Value Banner */}
      <div className="border-b border-white/10 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1F64AF]/20 flex items-center justify-center text-[#1F64AF]">
                <Truck className="w-5 h-5 text-[#5B9FE8]" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white">Delivered Across Nepal</h4>
                <p className="text-xs text-white/60">Doorstep delivery to all 7 provinces</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E5A116]/20 flex items-center justify-center text-[#E5A116]">
                <ShieldCheck className="w-5 h-5 text-[#E5A116]" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white">Cash On Delivery</h4>
                <p className="text-xs text-white/60">Inspect your book upon delivery & pay cash</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Heart className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white">Connecting Pages with People</h4>
                <p className="text-xs text-white/60">Curated with love for Nepali readers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="inline-block" aria-label="BookMello Home">
              <div className="bg-white/95 px-3 py-1.5 rounded-lg inline-block">
                <Image 
                  src="/bookmello-logo.svg" 
                  alt="BookMello" 
                  width={150} 
                  height={36} 
                  className="h-7 w-auto object-contain" 
                />
              </div>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              BookMello is Nepal&apos;s beloved independent book curator. We connect readers across Nepal with timeless classics, trending releases, and life-changing literature.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://wa.me/9779717028478" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                aria-label="WhatsApp BookMello"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.287.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.087-.179.182-.077.357.101.174.453.748.973 1.212.671.597 1.238.783 1.412.87.174.087.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.232-.144.39-.087s1.011.477 1.184.564.289.13.332.203c.044.072.044.419-.1 1.024z"/>
                </svg>
              </a>

              <a 
                href="https://instagram.com/shopbookmello" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                aria-label="Instagram BookMello"
              >
                <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                </svg>
              </a>

              <a 
                href="https://tiktok.com/@shopbookmello" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-black border border-white/20 flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                aria-label="TikTok BookMello"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .59.043.87.126V9.41a6.33 6.33 0 0 0-.87-.06A6.34 6.34 0 0 0 3 15.69a6.34 6.34 0 0 0 10.82 4.48c.32-.32.6-.68.83-1.07.2-.34.34-.7.42-1.08V9.38a8.16 8.16 0 0 0 4.52 1.36V7.32a4.85 4.85 0 0 1 0-.63z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Explore Links */}
          <div>
            <h4 className="font-serif font-bold text-base text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link href="/shop" className="hover:text-[#E5A116] transition-colors">Shop All Books</Link></li>
              <li><Link href="/shop?filter=featured" className="hover:text-[#E5A116] transition-colors">Staff Picks & Bestsellers</Link></li>
              <li><Link href="/shop?filter=new" className="hover:text-[#E5A116] transition-colors">New Arrivals</Link></li>
              <li><Link href="/shop" className="hover:text-[#E5A116] transition-colors">Browse Genres</Link></li>
            </ul>
          </div>

          {/* Delivery & Contact */}
          <div>
            <h4 className="font-serif font-bold text-base text-white mb-4">Customer Support</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#E5A116] shrink-0 mt-0.5" />
                <div>
                  <a href="https://wa.me/9779717028478" className="hover:text-white transition-colors block font-semibold text-white">
                    +977 9717028478
                  </a>
                  <span className="text-xs text-white/50">WhatsApp & Direct Calls</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#5B9FE8] shrink-0 mt-0.5" />
                <span>Kathmandu, Nepal (Delivering Nationwide)</span>
              </li>
              <li className="text-xs text-white/50 pt-1">
                Cash On Delivery available across Nepal. In-stock books delivered within 24-48 hours in Kathmandu Valley.
              </li>
            </ul>
          </div>

          {/* Direct Order Box */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-white mb-2">Book Request</h4>
            <p className="text-white/70 text-sm">
              Looking for a book that isn&apos;t listed on our store? We source it for you!
            </p>
            <a 
              href="https://wa.me/9779717028478?text=Hello%20BookMello,%20I'd%20like%20to%20request%20a%20book!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#E5A116] hover:bg-[#D08F0E] text-slate-950 font-bold text-sm shadow-md transition-colors"
            >
              Request via WhatsApp
            </a>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} BookMello™ Nepal. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Cash On Delivery</span>
            <span>Kathmandu & Nationwide</span>
            <span>@shopbookmello</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
