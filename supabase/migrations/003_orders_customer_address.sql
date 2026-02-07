-- Add delivery address to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_address TEXT;
