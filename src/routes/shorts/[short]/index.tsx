import { component$ } from '@builder.io/qwik'
import { DocumentHead, useLocation } from '@builder.io/qwik-city'
import { loader$ } from '@builder.io/qwik-city'
import { supabase } from '~/supabase'

export const useShort = loader$(async (event) => {
  const link = event.params.short
  const { data, error } = await supabase
    .from('shorts')
    .select()
    .eq('link', link)

  if (!data?.length || error) {
    throw event.redirect(302, '/')
  }
  return data?.[0]
})

export default component$(() => {
  const location = useLocation()

  const short = useShort().value
  const shortLink = `${location.url.origin}/${short.link}`

  return (
    <div class="relative isolate px-6 py-24 shadow-2xl sm:px-24 xl:py-32 h-screen gap-2 flex flex-col">
      <span>
        Short URL:{' '}
        <a
          href={shortLink}
          class="text-indigo-600 hover:underline"
        >
          {shortLink}
        </a>
      </span>
      <span>Destination: {short.destination}</span>
    </div>
  )
})

export const head: DocumentHead = {
  title: 'Qwikly',
  meta: [
    {
      name: 'description',
      content: 'Short your link',
    },
  ],
}
