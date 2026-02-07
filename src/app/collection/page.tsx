import { fetchProducts, staticProducts } from '@/lib/products';
import CollectionClient from './CollectionClient';

// Force fresh data on every request - Supabase products won't be cached
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CollectionPage() {
  let products;
  try {
    products = await fetchProducts();
  } catch (err) {
    console.error('Failed to load products:', err);
    products = staticProducts;
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-slide-up animate-fill-both">
          <h1 className="font-heading text-4xl md:text-5xl font-semibold text-text-dark mb-4">
            Our Collection
          </h1>
          <div className="w-24 h-1 bg-gold-accent mx-auto mb-6" />
          <p className="text-text-light max-w-2xl mx-auto font-light">
            Explore our handcrafted treasures, each piece waiting to become part
            of your story.
          </p>
        </div>
        <CollectionClient products={products} />
      </div>
    </section>
  );
}
