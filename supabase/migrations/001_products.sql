-- Products table for crochet collection
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('bags', 'flowers', 'clothing', 'baby', 'home')),
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  price_paise INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional - public read for products)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- Seed initial products (run once)
INSERT INTO products (name, category, description, image, price_paise, sort_order) VALUES
  ('Elegant Crochet Tote Bag', 'bags', 'A spacious and stylish tote bag perfect for daily use. Handcrafted with premium yarn.', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop', 249900, 1),
  ('Delicate Rose Bouquet', 'flowers', 'Beautiful crochet roses that never wilt. Perfect as a gift or home decoration.', 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&h=400&fit=crop', 89900, 2),
  ('Cozy Crochet Cardigan', 'clothing', 'Soft and warm cardigan made with love. Available in multiple sizes and colors.', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop', 349900, 3),
  ('Baby Blanket Set', 'baby', 'Ultra-soft blanket and matching accessories for your little one. Hypoallergenic yarn.', 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop', 199900, 4),
  ('Boho Wall Hanging', 'home', 'Elegant macramé-inspired wall decor to add warmth to any room.', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', 129900, 5),
  ('Chic Crossbody Bag', 'bags', 'Compact and fashionable crossbody bag with adjustable strap.', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop', 179900, 6),
  ('Sunflower Arrangement', 'flowers', 'Cheerful crochet sunflowers that bring sunshine to any space.', 'https://images.unsplash.com/photo-1597848212624-e593b7809d1a?w=400&h=400&fit=crop', 99900, 7),
  ('Crochet Beanie', 'clothing', 'Warm and stylish beanie perfect for chilly days. One size fits all.', 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&h=400&fit=crop', 79900, 8),
  ('Baby Booties & Hat Set', 'baby', 'Adorable matching set for newborns. Made with extra soft yarn.', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop', 149900, 9),
  ('Cozy Cushion Covers', 'home', 'Decorative cushion covers to refresh your living space.', 'https://images.unsplash.com/photo-1584100936595-8b8e49e3f445?w=400&h=400&fit=crop', 119900, 10),
  ('Market Bag', 'bags', 'Eco-friendly reusable market bag. Strong and spacious.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', 99900, 11),
  ('Lavender Bouquet', 'flowers', 'Fragrant-looking crochet lavender stems. Perfect for a calming atmosphere.', 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&h=400&fit=crop', 89900, 12)
;
