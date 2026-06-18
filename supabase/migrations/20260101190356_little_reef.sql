/*
  # Create vehicles table

  1. New Tables
    - `vehicles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `type` (enum: location, achat)
      - `status` (enum: neuf, occasion, importé)
      - `country` (text)
      - `city` (text)
      - `category` (enum: moto, berline, suv)
      - `brand` (text)
      - `model` (text)
      - `year` (integer)
      - `mileage` (integer)
      - `price` (numeric)
      - `engine` (enum: essence, diesel, hybride, electrique)
      - `power` (integer)
      - `power_unit` (enum: ch, kW)
      - `transmission` (enum: manuelle, automatique)
      - `consumption` (numeric, nullable)
      - `autonomy` (integer, nullable)
      - `seats` (integer, nullable)
      - `description` (text)
      - `images` (text array)
      - `daily_rate` (numeric, nullable)
      - `min_duration` (integer, nullable)
      - `max_duration` (integer, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `vehicles` table
    - Add policies for users to manage their own vehicles
    - Add policy for public read access to all vehicles
*/

CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text CHECK (type IN ('location', 'achat')) NOT NULL,
  status text CHECK (status IN ('neuf', 'occasion', 'importé')) NOT NULL DEFAULT 'occasion',
  country text NOT NULL,
  city text NOT NULL,
  category text CHECK (category IN ('moto', 'berline', 'suv')) NOT NULL,
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
  mileage integer NOT NULL DEFAULT 0 CHECK (mileage >= 0),
  price numeric NOT NULL CHECK (price > 0),
  engine text CHECK (engine IN ('essence', 'diesel', 'hybride', 'electrique')) NOT NULL,
  power integer NOT NULL CHECK (power > 0),
  power_unit text CHECK (power_unit IN ('ch', 'kW')) NOT NULL DEFAULT 'ch',
  transmission text CHECK (transmission IN ('manuelle', 'automatique')) NOT NULL,
  consumption numeric CHECK (consumption > 0),
  autonomy integer CHECK (autonomy > 0),
  seats integer CHECK (seats > 0 AND seats <= 50),
  description text NOT NULL,
  images text[] DEFAULT '{}',
  daily_rate numeric CHECK (daily_rate > 0),
  min_duration integer CHECK (min_duration > 0),
  max_duration integer CHECK (max_duration > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to all vehicles
CREATE POLICY "Public can read all vehicles"
  ON vehicles
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy for users to insert their own vehicles
CREATE POLICY "Users can insert own vehicles"
  ON vehicles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own vehicles
CREATE POLICY "Users can update own vehicles"
  ON vehicles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for users to delete their own vehicles
CREATE POLICY "Users can delete own vehicles"
  ON vehicles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger to update updated_at on vehicle changes
CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

-- Index for better query performance
CREATE INDEX IF NOT EXISTS vehicles_user_id_idx ON vehicles(user_id);
CREATE INDEX IF NOT EXISTS vehicles_type_idx ON vehicles(type);
CREATE INDEX IF NOT EXISTS vehicles_category_idx ON vehicles(category);
CREATE INDEX IF NOT EXISTS vehicles_country_city_idx ON vehicles(country, city);
CREATE INDEX IF NOT EXISTS vehicles_brand_model_idx ON vehicles(brand, model);
CREATE INDEX IF NOT EXISTS vehicles_created_at_idx ON vehicles(created_at DESC);