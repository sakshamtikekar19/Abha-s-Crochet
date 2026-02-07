-- Add image column if missing (table may have been created with different schema)
ALTER TABLE products ADD COLUMN IF NOT EXISTS image TEXT;

-- If your table has image_url instead of image, run this to copy data (uncomment and run if needed):
-- UPDATE products SET image = COALESCE(image_url, '') WHERE image IS NULL OR image = '';

-- Placeholder for rows with no image (optional - run if products have empty image)
-- UPDATE products SET image = 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop' WHERE image IS NULL OR image = '';
