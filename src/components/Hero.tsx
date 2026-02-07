'use client';

import Link from 'next/link';
import { config } from '@/lib/config';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-70 brightness-[0.6]"
        >
          <source src="/10474543-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-text-dark/30 z-10" />
      </div>
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-normal mb-6 bg-gradient-to-r from-cream via-gold-accent to-dusty-pink bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] leading-tight animate-slide-up animate-fill-both">
          Handmade with Love,
          <br />
          Stitched to Perfection
        </h1>
        <p className="text-cream/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto font-light leading-relaxed animate-slide-up animate-fill-both animate-delay-200">
          Discover our collection of premium crochet products, each piece crafted with patience, care, and the finest yarns.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animate-fill-both animate-delay-400">
          <Link href="/collection" className="btn-primary">
            Shop Collection
          </Link>
          <a
            href={config.whatsapp.getHrefWithMessage(config.whatsapp.defaultMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-cream border-cream hover:bg-cream hover:text-text-dark"
          >
            Order on WhatsApp
          </a>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-fade-in animate-fill-both animate-delay-500">
        <div className="w-6 h-10 rounded-full border-2 border-cream/60 flex justify-center pt-2 animate-bounce">
          <div className="w-1 h-2 bg-cream/80 rounded-full" />
        </div>
      </div>
    </section>
  );
}
