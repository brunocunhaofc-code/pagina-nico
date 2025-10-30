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
      brands: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          brand: string
          created_at: string
          description: string
          id: string
          images: string[]
          is_best_seller: boolean
          is_female: boolean
          is_male: boolean
          name: string
          price: number
        }
        Insert: {
          brand: string
          created_at?: string
          description: string
          id?: string
          images: string[]
          is_best_seller?: boolean
          is_female?: boolean
          is_male?: boolean
          name: string
          price: number
        }
        Update: {
          brand?: string
          created_at?: string
          description?: string
          id?: string
          images?: string[]
          is_best_seller?: boolean
          is_female?: boolean
          is_male?: boolean
          name?: string
          price?: number
        }
        Relationships: []
      }
      settings: {
        Row: {
          id: number
          section_order: Json | null
        }
        Insert: {
          id?: number
          section_order?: Json | null
        }
        Update: {
          id?: number
          section_order?: Json | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
