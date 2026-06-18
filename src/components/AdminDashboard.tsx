import React, { useEffect, useState } from 'react';
import { Users, Car, ShieldCheck, Trash2, BarChart2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface AdminDashboardProps {
  language: 'fr' | 'en';
}

interface VehicleRow {
  id: string;
  brand: string;
  model: string;
  type: string;
  city: string;
  country: string;
  price: number;
  created_at: string;
  profiles: { name: string; type: string; phone: string | null } | null;
}

interface ProfileRow {
  id: string;
  name: string;
  type: string;
  phone: string | null;
  company: string | null;
  created_at: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ language }) => {
  const { signOut } = useAuth();
  const [tab, setTab] = useState<'overview' | 'vehicles' | 'users'>('overview');
  const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  useEffect(() => {
    fetchVehicles();
    fetchProfiles();
  }, []);

  const fetchVehicles = async () => {
    setLoadingVehicles(true);
    const { data } = await supabase
      .from('vehicles')
      .select('id, brand, model, type, city, country, price, created_at, profiles!vehicles_user_id_fkey(name, type, phone)')
      .order('created_at', { ascending: false });
    setVehicles((data as any) || []);
    setLoadingVehicles(false);
  };

  const fetchProfiles = async () => {
    setLoadingProfiles(true);
    const { data } = await supabase
      .from('profiles')
      .select('id, name, type, phone, company, created_at')
      .order('created_at', { ascending: false });
    setProfiles(data || []);
    setLoadingProfiles(false);
  };

  const deleteVehicle = async (id: string) => {
    if (!confirm(language === 'fr' ? 'Supprimer cette annonce ?' : 'Delete this listing?')) return;
    await supabase.from('vehicles').delete().eq('id', id);
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  const tabs = [
    { key: 'overview', label: language === 'fr' ? 'Vue d\'ensemble' : 'Overview', icon: BarChart2 },
    { key: 'vehicles', label: language === 'fr' ? 'Annonces' : 'Listings', icon: Car },
    { key: 'users', label: language === 'fr' ? 'Utilisateurs' : 'Users', icon: Users },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 text-white px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck size={28} className="text-blue-300" />
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-blue-300 text-sm">Planet Pista — planetpista@gmail.com</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="text-sm text-blue-300 hover:text-white transition-colors"
          >
            {language === 'fr' ? 'Déconnexion' : 'Sign out'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white rounded-xl shadow-sm p-1 w-fit">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                tab === key
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6">
            <StatCard
              icon={<Car size={28} className="text-blue-600" />}
              label={language === 'fr' ? 'Total annonces' : 'Total listings'}
              value={vehicles.length}
              color="blue"
            />
            <StatCard
              icon={<Users size={28} className="text-green-600" />}
              label={language === 'fr' ? 'Utilisateurs' : 'Users'}
              value={profiles.length}
              color="green"
            />
            <StatCard
              icon={<ShieldCheck size={28} className="text-purple-600" />}
              label={language === 'fr' ? 'Professionnels' : 'Professionals'}
              value={profiles.filter(p => p.type === 'professionnel').length}
              color="purple"
            />
          </div>
        )}

        {/* Vehicles */}
        {tab === 'vehicles' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">
                {language === 'fr' ? `${vehicles.length} annonces` : `${vehicles.length} listings`}
              </h2>
            </div>
            {loadingVehicles ? (
              <div className="p-8 text-center text-gray-400">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {vehicles.map(v => (
                  <div key={v.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">{v.brand} {v.model}</div>
                      <div className="text-sm text-gray-500">
                        {v.city}, {v.country} •{' '}
                        <span className={v.type === 'location' ? 'text-green-600' : 'text-blue-600'}>
                          {v.type === 'location' ? (language === 'fr' ? 'Location' : 'Rental') : (language === 'fr' ? 'Vente' : 'Sale')}
                        </span>
                        {' '}• {v.price.toLocaleString()} XOF
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {language === 'fr' ? 'Par' : 'By'}: {v.profiles?.name} ({v.profiles?.type})
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-xs text-gray-400">
                        {new Date(v.created_at).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => deleteVehicle(v.id)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
                {vehicles.length === 0 && (
                  <div className="p-8 text-center text-gray-400">
                    {language === 'fr' ? 'Aucune annonce' : 'No listings'}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">
                {language === 'fr' ? `${profiles.length} utilisateurs` : `${profiles.length} users`}
              </h2>
            </div>
            {loadingProfiles ? (
              <div className="p-8 text-center">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {profiles.map(p => (
                  <div key={p.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        p.type === 'professionnel' ? 'bg-purple-500' : 'bg-blue-500'
                      }`}>
                        {(p.company || p.name).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{p.company || p.name}</div>
                        <div className="text-sm text-gray-500">
                          {p.phone || (language === 'fr' ? 'Pas de téléphone' : 'No phone')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        p.type === 'professionnel'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {p.type === 'professionnel'
                          ? (language === 'fr' ? 'Pro' : 'Pro')
                          : (language === 'fr' ? 'Particulier' : 'Individual')}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(p.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                {profiles.length === 0 && (
                  <div className="p-8 text-center text-gray-400">
                    {language === 'fr' ? 'Aucun utilisateur' : 'No users'}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'blue' | 'green' | 'purple';
}> = ({ icon, label, value, color }) => {
  const bg = { blue: 'bg-blue-50', green: 'bg-green-50', purple: 'bg-purple-50' }[color];
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-5">
      <div className={`w-14 h-14 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500 mt-0.5">{label}</div>
      </div>
    </div>
  );
};