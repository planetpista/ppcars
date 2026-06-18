/*
  # Storage policies for vehicle-images bucket

  1. Allow authenticated users to upload vehicle images
  2. Allow public read access to vehicle images
*/

-- Policy for authenticated users to upload vehicle images
CREATE POLICY "Authenticated users can upload vehicle images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'vehicle-images');

-- Policy for authenticated users to update their vehicle images
CREATE POLICY "Users can update vehicle images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'vehicle-images');

-- Policy for authenticated users to delete their vehicle images
CREATE POLICY "Users can delete vehicle images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'vehicle-images');

-- Policy for public read access to vehicle images
CREATE POLICY "Public can read vehicle images"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'vehicle-images');