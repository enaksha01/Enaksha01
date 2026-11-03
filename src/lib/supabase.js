import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dfozxtiheqnhnzzvvaxm.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ne2RLCwzr5LHAxIFpI0QoA_OQ4mS2Mw'

export const supabase = createClient(supabaseUrl, supabaseKey)
