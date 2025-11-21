import { createClient } from '@supabase/supabase-js';

// Database types for OAuth sessions
export interface OAuthSession {
    id?: string;
    session_id: string;
    user_id: string;
    connection_id: string;
    token_data?: any;
    created_at?: string;
    expires_at?: string;
}

// Initialize Supabase client
// Using non-null assertion with fallback to avoid build-time errors
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
