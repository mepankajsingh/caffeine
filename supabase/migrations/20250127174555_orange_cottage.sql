/*
  # Make database access public

  1. Changes
    - Drop existing RLS policies
    - Create new public access policies for all operations
    - Enable public read/write access to all tables
  
  2. Security
    - Enable RLS on all tables
    - Add policies for public access to all operations
*/

-- Drop existing policies
DO $$ 
BEGIN
  -- Categories policies
  DROP POLICY IF EXISTS "Allow public read access on categories" ON categories;
  DROP POLICY IF EXISTS "Allow authenticated users to modify categories" ON categories;
  
  -- Products policies
  DROP POLICY IF EXISTS "Allow public read access on products" ON products;
  DROP POLICY IF EXISTS "Allow authenticated users to modify products" ON products;
END $$;

-- Create new public access policies for categories
CREATE POLICY "Allow public access on categories"
  ON categories
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create new public access policies for products
CREATE POLICY "Allow public access on products"
  ON products
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);
