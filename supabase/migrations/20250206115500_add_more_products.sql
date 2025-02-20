-- Insert 14 more demo products
DO $$ 
DECLARE
  category_id uuid;
BEGIN
  SELECT id INTO category_id FROM categories WHERE slug = 'energy-drinks';

  -- Insert additional demo products
  INSERT INTO products (
    name, slug, description, price, image_url, category_id, 
    caffeine_content, brand, serving_size, nutrition_info,
    sugar_content, calories, packaging_type, country_of_origin,
    shelf_life, certifications
  )
  VALUES
    (
      'Sunrise Citrus Burst',
      'sunrise-citrus-burst',
      'Invigorating citrus flavored energy drink perfect for morning refreshment.',
      3.79,
      'https://example.com/sunrise-citrus-burst.jpg',
      category_id,
      140,
      'Morning Sun Co',
      '12 fl oz (355ml)',
      '{"vitamin_c": "75mg", "electrolytes": "180mg"}',
      17.0,
      150,
      'Aluminum Can',
      'United States',
      '15 months',
      ARRAY['Natural Flavors']
    ),
    (
      'Berry Blast Zero',
      'berry-blast-zero',
      'Zero calorie berry flavored energy drink with added antioxidants.',
      4.29,
      'https://example.com/berry-blast-zero.jpg',
      category_id,
      160,
      'Zero Zone Drinks',
      '16 fl oz (473ml)',
      '{"antioxidants": "400mg", "vitamin_b12": "8mcg"}',
      0.0,
      5,
      'Aluminum Can',
      'Canada',
      '18 months',
      ARRAY['Sugar-Free', 'Keto-Friendly']
    ),
    (
      'Mango Tango Energy',
      'mango-tango-energy',
      'Exotic mango flavored energy drink with a tropical twist.',
      3.99,
      'https://example.com/mango-tango-energy.jpg',
      category_id,
      130,
      'Tropicana Energy',
      '12 fl oz (355ml)',
      '{"vitamin_a": "25%", "vitamin_e": "30%"}',
      21.5,
      170,
      'Glass Bottle',
      'Mexico',
      '12 months',
      ARRAY['Natural Flavors']
    ),
    (
      'Lemon Lime Zing',
      'lemon-lime-zing',
      'Zesty lemon and lime flavored energy drink for a refreshing kick.',
      4.49,
      'https://example.com/lemon-lime-zing.jpg',
      category_id,
      150,
      'Zing Beverages',
      '16 fl oz (473ml)',
      '{"vitamin_c": "80mg", "potassium": "200mg"}',
      23.0,
      190,
      'Aluminum Can',
      'United Kingdom',
      '20 months',
      ARRAY['Vegan']
    ),
    (
      'Cranberry Charge',
      'cranberry-charge',
      'Cranberry flavored energy drink with a tangy and tart taste.',
      3.79,
      'https://example.com/cranberry-charge.jpg',
      category_id,
      140,
      'Cran Power',
      '12 fl oz (355ml)',
      '{"vitamin_k": "20%", "manganese": "25%"}',
      19.0,
      160,
      'Aluminum Can',
      'United States',
      '15 months',
      ARRAY['Gluten-Free']
    ),
    (
      'Orange Oasis',
      'orange-oasis',
      'Refreshing orange flavored energy drink with a citrusy burst.',
      4.29,
      'https://example.com/orange-oasis.jpg',
      category_id,
      160,
      'Oasis Drinks',
      '16 fl oz (473ml)',
      '{"vitamin_c": "100mg", "folate": "15%"}',
      25.0,
      210,
      'Glass Bottle',
      'Spain',
      '18 months',
      ARRAY['Natural Flavors']
    ),
    (
      'Grape Galaxy',
      'grape-galaxy',
      'Grape flavored energy drink with a cosmic twist.',
      3.99,
      'https://example.com/grape-galaxy.jpg',
      category_id,
      130,
      'Galaxy Beverages',
      '12 fl oz (355ml)',
      '{"vitamin_b3": "20mg", "chromium": "10%"}',
      16.5,
      145,
      'Aluminum Can',
      'Italy',
      '12 months',
      ARRAY['Vegan']
    ),
    (
      'Pineapple Power',
      'pineapple-power',
      'Pineapple flavored energy drink with a tropical punch.',
      4.49,
      'https://example.com/pineapple-power.jpg',
      category_id,
      150,
      'Power Fruits',
      '16 fl oz (473ml)',
      '{"vitamin_b5": "10mg", "magnesium": "15%"}',
      20.0,
      175,
      'Aluminum Can',
      'Thailand',
      '20 months',
      ARRAY['Natural Flavors']
    ),
    (
      'Kiwi Kickstart',
      'kiwi-kickstart',
      'Kiwi flavored energy drink with a tangy and sweet taste.',
      3.79,
      'https://example.com/kiwi-kickstart.jpg',
      category_id,
      140,
      'Kickstart Drinks',
      '12 fl oz (355ml)',
      '{"vitamin_e": "30%", "zinc": "10%"}',
      18.0,
      155,
      'Glass Bottle',
      'New Zealand',
      '15 months',
      ARRAY['Gluten-Free']
    ),
    (
      'Raspberry Rocket',
      'raspberry-rocket',
      'Raspberry flavored energy drink with a blast of energy.',
      4.29,
      'https://example.com/raspberry-rocket.jpg',
      category_id,
      160,
      'Rocket Fuel',
      '16 fl oz (473ml)',
      '{"vitamin_b6": "2.5mg", "copper": "5%"}',
      24.0,
      195,
      'Aluminum Can',
      'United Kingdom',
      '18 months',
      ARRAY['Vegan']
    ),
    (
      'Blueberry Burst',
      'blueberry-burst',
      'Blueberry flavored energy drink with a burst of antioxidants.',
      3.99,
      'https://example.com/blueberry-burst.jpg',
      category_id,
      130,
      'Berry Beverages',
      '12 fl oz (355ml)',
      '{"antioxidants": "450mg", "vitamin_c": "70mg"}',
      15.5,
      135,
      'Aluminum Can',
      'Canada',
      '12 months',
      ARRAY['Natural Flavors']
    ),
    (
      'Cherry Charge Zero',
      'cherry-charge-zero',
      'Zero sugar cherry flavored energy drink with a tangy kick.',
      4.49,
      'https://example.com/cherry-charge-zero.jpg',
      category_id,
      150,
      'Zero Zone Drinks',
      '16 fl oz (473ml)',
      '{"vitamin_b12": "10mcg", "chromium": "12%"}',
      0.0,
      10,
      'Aluminum Can',
      'United States',
      '20 months',
      ARRAY['Sugar-Free', 'Keto-Friendly']
    ),
    (
      'Watermelon Wave',
      'watermelon-wave',
      'Watermelon flavored energy drink with a refreshing wave of hydration.',
      3.79,
      'https://example.com/watermelon-wave.jpg',
      category_id,
      140,
      'Wave Drinks',
      '12 fl oz (355ml)',
      '{"electrolytes": "250mg", "potassium": "180mg"}',
      19.5,
      165,
      'Glass Bottle',
      'Brazil',
      '15 months',
      ARRAY['Natural Flavors']
    ),
    (
      'Passionfruit Punch',
      'passionfruit-punch',
      'Passionfruit flavored energy drink with a tropical punch.',
      4.29,
      'https://example.com/passionfruit-punch.jpg',
      category_id,
      160,
      'Tropical Energy',
      '16 fl oz (473ml)',
      '{"vitamin_a": "30%", "vitamin_e": "35%"}',
      21.0,
      185,
      'Aluminum Can',
      'Thailand',
      '18 months',
      ARRAY['Vegan']
    );
END $$;
