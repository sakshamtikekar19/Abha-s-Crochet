'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { config } from '@/lib/config';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/collection', label: 'Collection' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b animate-slide-down animate-fill-both ${
        scrolled || mobileMenuOpen
          ? 'bg-cream/95 backdrop-blur-xl border-gold-accent/10 py-2 shadow-sm'
          : 'bg-cream/95 backdrop-blur-sm border-gold-accent/10 py-2'
      }`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
        <Link href="/" className="flex items-center gap-3 font-heading text-xl font-semibold text-text-dark">
          <Image src="/logo.png" alt="Abha's Crochet Logo" width={64} height={64} className="object-contain" />
          <span>{config.brand.name}</span>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm uppercase tracking-[0.15em] transition-colors relative group ${
                  pathname === link.href ? 'text-text-dark font-medium' : 'text-text-light hover:text-text-dark'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gold-accent transition-all duration-300 ${
                  pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 z-50 relative"
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-text-dark origin-center transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-text-dark transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-text-dark origin-center transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-cream border-t border-gold-accent/10">
          <ul className="py-6 px-4 space-y-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 text-center uppercase tracking-widest text-lg ${
                    pathname === link.href ? 'text-text-dark font-medium' : 'text-text-light'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
