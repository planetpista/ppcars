/*
  # Create transactions table

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `transaction_id` (text, unique - PayPal transaction ID)
      - `amount` (numeric)
      - `currency` (text)
      - `status` (text)
      - `payment_method` (text)
      - `vehicle_id` (text, nullable)
      - `user_id` (text, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `transactions` table
    - Add policies for users to read their own transactions
*/

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id text UNIQUE NOT NULL,
  amount numeric NOT NULL,
  currency text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payment_method text NOT NULL DEFAULT 'paypal',
  vehicle_id text,
  user_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own transactions
CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid()::text);

-- Index for better query performance
CREATE INDEX IF NOT EXISTS transactions_transaction_id_idx ON transactions(transaction_id);
CREATE INDEX IF NOT EXISTS transactions_user_id_idx ON transactions(user_id);
CREATE INDEX IF NOT EXISTS transactions_created_at_idx ON transactions(created_at DESC);