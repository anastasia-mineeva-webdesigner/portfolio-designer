// Demonstration contacts: replace service homepages with the real public profiles.
export const links = {
  telegram: 'https://telegram.org/' as string | null,
  behance: 'https://www.behance.net/' as string | null,
  dribbble: 'https://dribbble.com/' as string | null,
  linkedin: 'https://www.linkedin.com/' as string | null,
  email: 'hello@example.com' as string | null,
  cv: '/cv/' as string | null,
  projects: [null, null, null, null, null, null] as (string | null)[],
};

export const menuContactLinks = {
  email: 'hello@uprock.ru',
  socials: [
    ['Behance', 'https://www.behance.net/uprockpro'],
    ['Dribbble', 'https://dribbble.com/uprockpro'],
    ['Telegram', 'https://t.me/uprockpro'],
    ['Awwwards', 'https://www.awwwards.com/Uprock/'],
  ],
};
