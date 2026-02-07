import { createSupabaseAdminClient } from './supabase-admin';

export type ProductCategory = 'bags' | 'flowers' | 'clothing' | 'baby' | 'home';

export interface Product {
  id: string | number;
  name: string;
  category: ProductCategory;
  description: string;
  image: string;
  price_paise?: number;
  in_stock?: boolean;
}

// Static fallback when Supabase is not configured
export const staticProducts: Product[] = [
  { id: 1, name: 'Elegant Crochet Tote Bag', category: 'bags', description: 'A spacious and stylish tote bag perfect for daily use. Handcrafted with premium yarn.', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop', price_paise: 249900 },
  { id: 2, name: 'Delicate Rose Bouquet', category: 'flowers', description: 'Beautiful crochet roses that never wilt. Perfect as a gift or home decoration.', image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&h=400&fit=crop', price_paise: 89900 },
  { id: 3, name: 'Cozy Crochet Cardigan', category: 'clothing', description: 'Soft and warm cardigan made with love. Available in multiple sizes and colors.', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop', price_paise: 349900 },
  { id: 4, name: 'Baby Blanket Set', category: 'baby', description: 'Ultra-soft blanket and matching accessories for your little one. Hypoallergenic yarn.', image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop', price_paise: 199900 },
  { id: 5, name: 'Boho Wall Hanging', category: 'home', description: 'Elegant macramé-inspired wall decor to add warmth to any room.', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', price_paise: 129900 },
  { id: 6, name: 'Chic Crossbody Bag', category: 'bags', description: 'Compact and fashionable crossbody bag with adjustable strap.', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop', price_paise: 179900 },
  { id: 7, name: 'Sunflower Arrangement', category: 'flowers', description: 'Cheerful crochet sunflowers that bring sunshine to any space.', image: 'https://images.unsplash.com/photo-1597848212624-e593b7809d1a?w=400&h=400&fit=crop', price_paise: 99900 },
  { id: 8, name: 'Crochet Beanie', category: 'clothing', description: 'Warm and stylish beanie perfect for chilly days. One size fits all.', image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&h=400&fit=crop', price_paise: 79900 },
  { id: 9, name: 'Baby Booties & Hat Set', category: 'baby', description: 'Adorable matching set for newborns. Made with extra soft yarn.', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop', price_paise: 149900 },
  { id: 10, name: 'Cozy Cushion Covers', category: 'home', description: 'Decorative cushion covers to refresh your living space.', image: 'https://images.unsplash.com/photo-1584100936595-8b8e49e3f445?w=400&h=400&fit=crop', price_paise: 119900 },
  { id: 11, name: 'Market Bag', category: 'bags', description: 'Eco-friendly reusable market bag. Strong and spacious.', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', price_paise: 99900 },
  { id: 12, name: 'Lavender Bouquet', category: 'flowers', description: 'Fragrant-looking crochet lavender stems. Perfect for a calming atmosphere.', image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&h=400&fit=crop', price_paise: 89900 },
];

export async function fetchProducts(
  category?: ProductCategory
): Promise<Product[]> {
  // Use admin client (service role) - bypasses RLS, runs server-side only
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    const products = staticProducts;
    return category
      ? products.filter((p) => p.category === category)
      : products;
  }

  // select('*') works with any schema (image, image_url, etc.)
  let query = supabase.from('products').select('*');
  if (category) {
    query = query.eq('category', category);
  }
  const { data, error } = await query;

  if (error) {
    console.error('Supabase products fetch error:', error);
    return [];
  }

  // If table is empty, show static products so the page isn't blank
  if (!data?.length) {
    return category
      ? staticProducts.filter((p) => p.category === category)
      : [...staticProducts];
  }

  const validCategories: ProductCategory[] = ['bags', 'flowers', 'clothing', 'baby', 'home'];
  const defaultImage = 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop';

  const rows = [...data].sort((a, b) => {
    const aOrd = Number((a as Record<string, unknown>).sort_order) ?? 0;
    const bOrd = Number((b as Record<string, unknown>).sort_order) ?? 0;
    return aOrd - bOrd;
  });

  function toPaise(row: Record<string, unknown>): number {
    const paise = Number(row.price_paise);
    if (paise > 0) return paise;
    const rupees = Number(row.price_rupees ?? row.price ?? 0);
    if (rupees > 0) return Math.round(rupees * 100);
    return 0;
  }

  return rows.map((row: Record<string, unknown>) => ({
    id: row.id as string | number,
    name: String(row.name ?? ''),
    category: (validCategories.includes(row.category as ProductCategory) ? row.category : 'bags') as ProductCategory,
    description: String(row.description ?? ''),
    image: String(row.image ?? row.image_url ?? row.img ?? defaultImage),
    price_paise: toPaise(row),
    in_stock: row.in_stock !== false,
  }));
}
