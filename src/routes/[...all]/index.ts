import type { RequestEvent } from '@builder.io/qwik-city'
import { supabase } from '~/supabase'

export async function onGet(event: RequestEvent) {
  const link = event.params.all
  const { data, error } = await supabase
    .from('shorts')
    .select()
    .eq('link', link)

  if (!data?.length || error) {
    throw event.redirect(302, '/')
  }

  throw event.redirect(302, data?.[0].destination)
}
