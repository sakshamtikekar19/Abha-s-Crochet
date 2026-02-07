import Image from 'next/image';
import { config } from '@/lib/config';
import RazorpayCheckout from './RazorpayCheckout';
import type { Product } from '@/lib/products';

interface ProductCardProps {
  product: Product;
}

function formatPrice(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}

export default function ProductCard({ product }: ProductCardProps) {
  const whatsappHref = config.whatsapp.getHrefWithMessage(
    `Hi! I'm interested in ${product.name}`
  );

  return (
    <article className="group bg-cream rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="block flex-1">
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-6">
          <span className="text-xs uppercase tracking-[0.15em] text-gold-accent font-medium">
            {product.category}
          </span>
          <h3 className="font-heading text-xl font-semibold text-text-dark mt-2 mb-2">
            {product.name}
          </h3>
          <p className="text-text-light text-sm line-clamp-2 mb-3 font-light leading-relaxed">
            {product.description}
          </p>
          <p className="text-text-dark font-semibold">
            {product.price_paise != null && product.price_paise > 0
              ? formatPrice(product.price_paise)
              : 'Contact for price'}
          </p>
        </div>
      </a>
      <div className="px-6 pb-6 flex gap-2">
        <RazorpayCheckout
          product={product}
          className="btn-primary flex-1 py-3 text-sm"
          children="Buy Now"
        />
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex-1 py-3 text-sm text-center"
        >
          Inquire
        </a>
      </div>
    </article>
  );
}
