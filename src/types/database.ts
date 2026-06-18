export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          type: 'particulier' | 'professionnel'
          name: string
          phone: string | null
          company: string | null
          address: string | null
          profile_picture: string | null
          logo: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'particulier' | 'professionnel'
          name: string
          phone?: string | null
          company?: string | null
          address?: string | null
          profile_picture?: string | null
          logo?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'particulier' | 'professionnel'
          name?: string
          phone?: string | null
          company?: string | null
          address?: string | null
          profile_picture?: string | null
          logo?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          user_id: string
          type: 'location' | 'achat'
          status: 'neuf' | 'occasion' | 'importé'
          country: string
          city: string
          category: 'moto' | 'berline' | 'suv'
          brand: string
          model: string
          year: number
          mileage: number
          price: number
          engine: 'essence' | 'diesel' | 'hybride' | 'electrique'
          power: number
          power_unit: 'ch' | 'kW'
          transmission: 'manuelle' | 'automatique'
          consumption: number | null
          autonomy: number | null
          seats: number | null
          description: string
          images: Json
          daily_rate: number | null
          min_duration: number | null
          max_duration: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'location' | 'achat'
          status?: 'neuf' | 'occasion' | 'importé'
          country: string
          city: string
          category: 'moto' | 'berline' | 'suv'
          brand: string
          model: string
          year: number
          mileage?: number
          price: number
          engine: 'essence' | 'diesel' | 'hybride' | 'electrique'
          power: number
          power_unit?: 'ch' | 'kW'
          transmission: 'manuelle' | 'automatique'
          consumption?: number | null
          autonomy?: number | null
          seats?: number | null
          description: string
          images?: Json
          daily_rate?: number | null
          min_duration?: number | null
          max_duration?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'location' | 'achat'
          status?: 'neuf' | 'occasion' | 'importé'
          country?: string
          city?: string
          category?: 'moto' | 'berline' | 'suv'
          brand?: string
          model?: string
          year?: number
          mileage?: number
          price?: number
          engine?: 'essence' | 'diesel' | 'hybride' | 'electrique'
          power?: number
          power_unit?: 'ch' | 'kW'
          transmission?: 'manuelle' | 'automatique'
          consumption?: number | null
          autonomy?: number | null
          seats?: number | null
          description?: string
          images?: Json
          daily_rate?: number | null
          min_duration?: number | null
          max_duration?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          transaction_id: string
          amount: number
          currency: string
          status: string
          payment_method: string
          vehicle_id: string | null
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          transaction_id: string
          amount: number
          currency: string
          status?: string
          payment_method?: string
          vehicle_id?: string | null
          user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          transaction_id?: string
          amount?: number
          currency?: string
          status?: string
          payment_method?: string
          vehicle_id?: string | null
          user_id?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}