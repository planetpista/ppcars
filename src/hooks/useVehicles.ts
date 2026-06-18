import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Vehicle } from '../types';
import { Database } from '../types/database';

type VehicleRow = Database['public']['Tables']['vehicles']['Row'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('vehicles')
        .select(`
          *,
          profiles!vehicles_user_id_fkey (*)
        `)
        .order('created_at', { ascending: false });

      if (vehiclesError) {
        throw vehiclesError;
      }

      // Transform database data to Vehicle type
      const transformedVehicles: Vehicle[] = (vehiclesData || []).map((vehicle: any) => ({
        id: vehicle.id,
        userId: vehicle.user_id,
        user: {
          id: vehicle.profiles.user_id,
          type: vehicle.profiles.type,
          name: vehicle.profiles.name,
          email: vehicle.profiles.user_id, // We'll need to get this from auth
          phone: vehicle.profiles.phone || '',
          profilePicture: vehicle.profiles.profile_picture,
          company: vehicle.profiles.company,
          address: vehicle.profiles.address,
          logo: vehicle.profiles.logo
        },
        type: vehicle.type,
        status: vehicle.status,
        country: vehicle.country,
        city: vehicle.city,
        category: vehicle.category,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        mileage: vehicle.mileage,
        price: vehicle.price,
        engine: vehicle.engine,
        power: vehicle.power,
        powerUnit: vehicle.power_unit,
        transmission: vehicle.transmission,
        consumption: vehicle.consumption,
        autonomy: vehicle.autonomy,
        seats: vehicle.seats,
        description: vehicle.description,
        images: vehicle.images || [],
        dailyRate: vehicle.daily_rate,
        minDuration: vehicle.min_duration,
        maxDuration: vehicle.max_duration,
        createdAt: new Date(vehicle.created_at),
        updatedAt: new Date(vehicle.updated_at)
      }));

      setVehicles(transformedVehicles);
    } catch (err: any) {
      console.error('Error fetching vehicles:', err);
      setError(err.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchVehicles();
  };

  useEffect(() => {
    fetchVehicles();

    // Set up real-time subscription
    const subscription = supabase
      .channel('vehicles_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'vehicles' 
        }, 
        () => {
          fetchVehicles();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    vehicles,
    loading,
    error,
    refetch
  };
};