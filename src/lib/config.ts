/**
 * Central config from environment variables.
 * Set these in .env.local for local dev, or in your hosting provider (Vercel, etc.) for production.
 */

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '1234567890';
const rawWhatsAppMessage =
  process.env.NEXT_PUBLIC_WHATSAPP_DEFAULT_MESSAGE || "Hi! I'm interested in your crochet products.";
const whatsappDefaultMessage =
  rawWhatsAppMessage.replace(/\uFFFD/g, '').trim() || "Hi! I'm interested in your crochet products.";

const instagramHandle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || 'yourhandle';

export const config = {
  whatsapp: {
    number: whatsappNumber,
    defaultMessage: whatsappDefaultMessage,
    href: `https://wa.me/${whatsappNumber}`,
    getHrefWithMessage: (text: string) =>
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`,
  },

  instagram: {
    handle: instagramHandle,
    url: `https://instagram.com/${instagramHandle}`,
  },

  // Brand
  brand: {
    name: process.env.NEXT_PUBLIC_BRAND_NAME || 'Handmade Crochet',
    tagline: process.env.NEXT_PUBLIC_BRAND_TAGLINE || 'Handcrafted Crochet Made in India',
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'your.email@example.com',
  },

  // Supabase (server + client)
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },

  // Razorpay (client key for checkout script)
  razorpay: {
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  },
} as const;
