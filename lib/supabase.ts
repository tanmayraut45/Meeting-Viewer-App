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

// Initialize Supabase client with dummy values for build-time
// Real values will be used at runtime from environment variables
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Runtime validation helper
export function validateSupabaseConfig() {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
        throw new Error('Missing Supabase environment variables. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in Vercel.');
    }
}
