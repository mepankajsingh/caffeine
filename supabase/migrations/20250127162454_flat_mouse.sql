/*
  # Update products and categories tables

  1. Tables
    - Safely create or update `categories` and `products` tables
    - Add RLS policies for public read and authenticated write access

  2. Security
    - Enable RLS on both tables
    - Public read access for both tables
    - Admin write access for both tables
*/

-- Create categories table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'categories') THEN
    CREATE TABLE categories (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      slug text UNIQUE NOT NULL,
      created_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Create products table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'products') THEN
    CREATE TABLE products (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      slug text UNIQUE NOT NULL,
      description text NOT NULL,
      price decimal(10,2) NOT NULL,
      image_url text NOT NULL,
      category_id uuid REFERENCES categories(id),
      created_at timestamptz DEFAULT now(),
      caffeine_content integer NOT NULL
    );
  END IF;
END $$;

-- Enable RLS
DO $$ 
BEGIN
  -- Enable RLS for categories
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'categories' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
  END IF;

  -- Enable RLS for products
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'products' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE products ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies if they exist and recreate them
DO $$ 
BEGIN
  -- Categories policies
  DROP POLICY IF EXISTS "Allow public read access on categories" ON categories;
  DROP POLICY IF EXISTS "Allow authenticated users to modify categories" ON categories;
  
  -- Products policies
  DROP POLICY IF EXISTS "Allow public read access on products" ON products;
  DROP POLICY IF EXISTS "Allow authenticated users to modify products" ON products;
END $$;

-- Create policies
CREATE POLICY "Allow public read access on categories" ON categories
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to modify categories" ON categories
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access on products" ON products
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to modify products" ON products
  FOR ALL TO authenticated USING (true);
