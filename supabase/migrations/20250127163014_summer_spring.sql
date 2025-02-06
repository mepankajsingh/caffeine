/*
  # Add demo products

  1. Changes
    - Insert demo category
    - Insert 6 demo products with detailed information
*/

-- Insert demo category if it doesn't exist
INSERT INTO categories (name, slug)
SELECT 'Energy Drinks', 'energy-drinks'
WHERE NOT EXISTS (
  SELECT 1 FROM categories WHERE slug = 'energy-drinks'
);

-- Get the category id
DO $$ 
DECLARE
  category_id uuid;
BEGIN
  SELECT id INTO category_id FROM categories WHERE slug = 'energy-drinks';

  -- Insert demo products
  INSERT INTO products (
    name, slug, description, price, image_url, category_id, 
    caffeine_content, brand, serving_size, nutrition_info,
    sugar_content, calories, packaging_type, country_of_origin,
    shelf_life, certifications
  )
  VALUES
    (
      'Thunder Bolt Energy',
      'thunder-bolt-energy',
      'A powerful energy drink that provides instant energy boost with a unique blend of vitamins and minerals.',
      3.99,
      'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&q=80&w=800',
      category_id,
      160,
      'Thunder Beverages',
      '16 fl oz (473ml)',
      '{"protein": "0g", "vitamin_b6": "2.5mg", "vitamin_b12": "6mcg", "niacin": "20mg", "pantothenic_acid": "10mg"}',
      24.5,
      200,
      'Aluminum Can',
      'United States',
      '18 months',
      ARRAY['Vegan', 'Gluten-Free']
    ),
    (
      'Green Rush Energy',
      'green-rush-energy',
      'Natural energy drink made with green tea extract and natural caffeine sources.',
      4.49,
      'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=800',
      category_id,
      120,
      'Natural Boost Co',
      '12 fl oz (355ml)',
      '{"protein": "1g", "vitamin_c": "60mg", "green_tea_extract": "200mg", "ginseng": "100mg"}',
      16.0,
      140,
      'Glass Bottle',
      'Canada',
      '12 months',
      ARRAY['Organic', 'Non-GMO', 'Fair Trade']
    ),
    (
      'Midnight Focus',
      'midnight-focus',
      'Zero sugar energy drink designed for night owls and late-night productivity.',
      3.99,
      'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&q=80&w=800',
      category_id,
      200,
      'Focus Labs',
      '16 fl oz (473ml)',
      '{"taurine": "1000mg", "l_carnitine": "500mg", "vitamin_b_complex": "100%"}',
      0.0,
      10,
      'Aluminum Can',
      'United States',
      '24 months',
      ARRAY['Sugar-Free', 'Keto-Friendly']
    ),
    (
      'Tropical Surge',
      'tropical-surge',
      'Tropical fruit flavored energy drink with natural caffeine from guarana.',
      4.29,
      'https://images.unsplash.com/photo-1614973362434-63cd9bca58f7?auto=format&fit=crop&q=80&w=800',
      category_id,
      140,
      'Island Energy',
      '12 fl oz (355ml)',
      '{"guarana_extract": "200mg", "vitamin_c": "100mg", "electrolytes": "150mg"}',
      18.5,
      160,
      'Aluminum Can',
      'Brazil',
      '15 months',
      ARRAY['Natural Flavors', 'No Artificial Colors']
    ),
    (
      'Arctic Blast',
      'arctic-blast',
      'Refreshing mint-flavored energy drink with electrolytes for enhanced hydration.',
      3.79,
      'https://images.unsplash.com/photo-1621506289865-179c6e5fec73?auto=format&fit=crop&q=80&w=800',
      category_id,
      150,
      'Polar Energy',
      '16 fl oz (473ml)',
      '{"electrolytes": "300mg", "b_vitamins": "100%", "zinc": "5mg"}',
      22.0,
      180,
      'Aluminum Can',
      'Norway',
      '18 months',
      ARRAY['BPA-Free']
    ),
    (
      'Berry Boost Plus',
      'berry-boost-plus',
      'Mixed berry energy drink enriched with antioxidants and B-vitamins.',
      4.99,
      'https://images.unsplash.com/photo-1622543925523-7890fb58fae4?auto=format&fit=crop&q=80&w=800',
      category_id,
      130,
      'Vitality Drinks',
      '16 fl oz (473ml)',
      '{"antioxidants": "500mg", "vitamin_b12": "12mcg", "vitamin_c": "80mg"}',
      20.0,
      170,
      'Aluminum Can',
      'United States',
      '15 months',
      ARRAY['Vitamin-Enriched', 'Natural Caffeine']
    );
END $$;
