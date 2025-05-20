
import type { Database } from '@/integrations/supabase/types';

// Define types based on the auto-generated Supabase types
export type ProfileType = Database['public']['Tables']['profiles']['Row'];
export type EventType = Database['public']['Tables']['events']['Row'];

// Define types for inserting new records
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type EventInsert = Database['public']['Tables']['events']['Insert'];

// Define types for updating records
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type EventUpdate = Database['public']['Tables']['events']['Update'];
