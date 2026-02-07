'use client';

import { useState } from 'react';
import { type Product, type ProductCategory } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

const categories: { value: ProductCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'bags', label: 'Bags' },
  { value: 'flowers', label: 'Flowers' },
  { value: 'home', label: 'Home Decor' },
];

interface CollectionClientProps {
  products: Product[];
}

const COLLECTION_CATEGORIES: ProductCategory[] = ['bags', 'flowers', 'home'];

export default function CollectionClient({ products }: CollectionClientProps) {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');

  const collectionProducts = products.filter((p) => COLLECTION_CATEGORIES.includes(p.category));
  const filteredProducts =
    activeCategory === 'all'
      ? collectionProducts
      : collectionProducts.filter((p) => p.category === activeCategory);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-2 mb-12 animate-slide-up animate-fill-both animate-delay-200">
        {categories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setActiveCategory(cat.value)}
            className={`px-6 py-2 rounded-full text-sm uppercase tracking-widest transition-all ${
              activeCategory === cat.value
                ? 'bg-text-dark text-cream shadow-md'
                : 'bg-dusty-pink/30 text-text-dark hover:bg-dusty-pink/50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.length === 0 ? (
          <p className="col-span-full text-center text-text-light py-12 animate-fade-in animate-fill-both">
            No products found. Add products in the{' '}
            <a href="/admin/login" className="text-amber-700 hover:underline">admin panel</a>.
          </p>
        ) : (
          filteredProducts.map((product, i) => (
            <div
              key={product.id}
              className="animate-slide-up animate-fill-both"
              style={{ animationDelay: `${150 + i * 80}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))
        )}
      </div>
    </>
  );
}
