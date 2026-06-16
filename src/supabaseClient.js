import { createClient } from '@supabase/supabase-js';

// Encontrarás estas llaves en la sección Project Settings > API de tu panel de Supabase
const supabaseUrl = 'https://offmhdrfjttcsvmvjsbq.supabase.co';
const supabaseAnonKey = 'sb_publishable_CFxXOnJJLCLnmLKUuT3Q8Q_SJCHXRts';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);