import { component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'
import { action$, Form } from '@builder.io/qwik-city'
import { loader$ } from '@builder.io/qwik-city'
import { supabase } from '~/supabase'

import { nanoid } from 'nanoid'

export const useShorts = loader$(async () => {
  const { data } = await supabase
    .from('shorts')
    .select()
    .order('created_at', { ascending: false })
  const result = data ?? []
  return result
})

export const useShortAction = action$(async (data) => {
  const link = nanoid(5)
  const destination = data.destination.toString().startsWith('http')
    ? data.destination
    : `https://${data.destination}`

  await supabase.from('shorts').insert({ link, destination })
  // throw event.redirect(302, `/shorts/${link}`)
  return {
    link,
    destination,
  }
})

export default component$(() => {
  const shorts = useShorts()
  const action = useShortAction()

  return (
    <div class="relative isolate overflow-hidde px-6 py-24 shadow-2xl sm:px-24 xl:py-32 h-screen">
      <div class="mx-auto mt-10 flex max-w-3xl gap-x-4 flex-col">
        <h2 class="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Shorten your URL
        </h2>
        <p class="mx-auto mt-2 max-w-xl text-center text-lg leading-8 text-gray-500">
          Add your very long URL in the input below and click on the button to
          make it shorter
        </p>
        <Form
          action={action}
          class="flex gap-4"
        >
          <label
            for="destination"
            class="sr-only"
          >
            https://www.example.com
          </label>
          <input
            id="destination"
            name="destination"
            type="text"
            required
            class="min-w-0 flex-auto rounded-md border border-gray-900/10 text-base px-3 leading-7 text-gray-900 placeholder-gray-500 shadow-sm focus:border-indigo-600 focus:ring-indigo-600"
            placeholder="Enter your URL"
          />
          <button
            type="submit"
            class="flex-none rounded-md bg-indigo-600 py-1.5 px-3.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Shorten URL
          </button>
        </Form>

        {action.value && (
          <section class="shadow-lg my-8 p-4 border border-zinc-100 rounded-md">
            <div class="flex">
              {action.value.destination}
              <a
                href={action.value.link}
                class="ml-auto text-indigo-600"
              >
                {action.value.link}
              </a>
            </div>
          </section>
        )}
      </div>

      <div class="mt-10 border-t-2">
        <h3 class="my-4 text-lg font-medium">Last created links</h3>
        <div class="flex gap-2 flex-wrap">
          {shorts.value.map((short) => (
            <a
              href={`/shorts/${short.link}`}
              class="hover:underline inline-flex items-center rounded-full bg-indigo-100 px-3 py-0.5 text-sm font-medium text-indigo-800"
            >
              {short.link}
            </a>
          ))}
        </div>
      </div>
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
