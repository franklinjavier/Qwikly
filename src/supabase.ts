import { createClient } from '@supabase/supabase-js'

const viteEnv = import.meta.env

export const supabase = createClient(
  viteEnv.VITE_SUPABASE_URL as string,
  viteEnv.VITE_SUPABASE_SECRET as string
)
