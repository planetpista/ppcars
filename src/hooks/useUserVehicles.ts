import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { Vehicle } from '../types';

export const useUserVehicles = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserVehicles = async () => {
    if (!user) {
      setVehicles([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('vehicles')
        .select(`
          *,
          profiles!vehicles_user_id_fkey (*)
        `)
        .eq('user_id', user.id)
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
          email: user.email || '',
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
      console.error('Error fetching user vehicles:', err);
      setError(err.message || 'Failed to fetch user vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserVehicles();

    // Set up real-time subscription for user's vehicles
    if (user) {
      const subscription = supabase
        .channel('user_vehicles_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'vehicles',
            filter: `user_id=eq.${user.id}`
          }, 
          () => {
            fetchUserVehicles();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  return {
    vehicles,
    loading,
    error,
    refetch: fetchUserVehicles
  };
};