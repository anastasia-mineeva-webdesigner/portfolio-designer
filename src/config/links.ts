// Replace null with the real destination. No invented social profiles or case URLs.
export const links = {
  telegram: null as string | null,
  behance: null as string | null,
  dribbble: null as string | null,
  linkedin: null as string | null,
  email: 'a.mineeva.designer@yandex.ru' as string | null,
  cv: '/cv/' as string | null,
  projects: [null, null, null, null, null, null] as (string | null)[],
};
