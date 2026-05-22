// hooks/useSupabaseClient.js
import { useSession } from '@clerk/react'
import { createClient } from '@supabase/supabase-js'

export function useSupabaseClient() {
  const { session } = useSession()

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      accessToken: async () => session?.getToken() ?? null,
    }
  )

  return supabase
}