/*
  # Update products table schema

  1. Changes
    - Add new columns to products table:
      - brand (text)
      - serving_size (text)
      - nutrition_info (jsonb)
      - sugar_content (decimal)
      - calories (integer)
      - packaging_type (text)
      - country_of_origin (text)
      - shelf_life (text)
      - certifications (text[])
*/

-- Add new columns to products table
DO $$ 
BEGIN
  -- Add brand column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'brand'
  ) THEN
    ALTER TABLE products ADD COLUMN brand text NOT NULL DEFAULT '';
  END IF;

  -- Add serving_size column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'serving_size'
  ) THEN
    ALTER TABLE products ADD COLUMN serving_size text NOT NULL DEFAULT '';
  END IF;

  -- Add nutrition_info column (as JSONB to store detailed nutrition information)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'nutrition_info'
  ) THEN
    ALTER TABLE products ADD COLUMN nutrition_info jsonb NOT NULL DEFAULT '{}';
  END IF;

  -- Add sugar_content column (in grams)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'sugar_content'
  ) THEN
    ALTER TABLE products ADD COLUMN sugar_content decimal(10,2) NOT NULL DEFAULT 0;
  END IF;

  -- Add calories column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'calories'
  ) THEN
    ALTER TABLE products ADD COLUMN calories integer NOT NULL DEFAULT 0;
  END IF;

  -- Add packaging_type column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'packaging_type'
  ) THEN
    ALTER TABLE products ADD COLUMN packaging_type text NOT NULL DEFAULT '';
  END IF;

  -- Add country_of_origin column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'country_of_origin'
  ) THEN
    ALTER TABLE products ADD COLUMN country_of_origin text NOT NULL DEFAULT '';
  END IF;

  -- Add shelf_life column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'shelf_life'
  ) THEN
    ALTER TABLE products ADD COLUMN shelf_life text NOT NULL DEFAULT '';
  END IF;

  -- Add certifications column (as array to store multiple certifications)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'certifications'
  ) THEN
    ALTER TABLE products ADD COLUMN certifications text[] NOT NULL DEFAULT '{}';
  END IF;
END $$;
