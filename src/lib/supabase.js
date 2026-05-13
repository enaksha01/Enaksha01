import { createClient } from '@supabase/supabase-js'

// Ye rahi teri keys jo humne mehnat se nikaali thi
const supabaseUrl = 'https://dfozxtiheqnhnzzvvaxm.supabase.co'
const supabaseKey = 'sb_publishable_ne2RLCwzr5LHAxIFpI0QoA_OQ4mS2Mw'

export const supabase = createClient(supabaseUrl, supabaseKey)
