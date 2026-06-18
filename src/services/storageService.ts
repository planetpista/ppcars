import { supabase } from '../lib/supabase';

export const uploadVehicleImage = async (
  file: File,
  userId: string,
  vehicleIndex: string
): Promise<string | null> => {
  try {
    const ext = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}_${vehicleIndex}.${ext}`;

    const { error } = await supabase.storage
      .from('vehicle-images')
      .upload(fileName, file, { upsert: true });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data } = supabase.storage
      .from('vehicle-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (err) {
    console.error('Storage error:', err);
    return null;
  }
};

export const deleteVehicleImage = async (url: string): Promise<boolean> => {
  try {
    const path = url.split('/vehicle-images/')[1];
    if (!path) return false;

    const { error } = await supabase.storage
      .from('vehicle-images')
      .remove([path]);

    return !error;
  } catch {
    return false;
  }
};