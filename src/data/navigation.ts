import products from './products.json';

export type NavLink = { label: string; href: string; description?: string };

// Product names as they appear in the live site menu, where they differ from the page H1.
const MENU_NAMES: Record<string, string> = {
  'voise-ad-server': 'Voise Ad Server',
  'auction-platform': 'Voise Curation/Auction Packages',
};

const byCategory = (category: string): NavLink[] =>
  products
    .filter((p) => p.category === category)
    .map((p) => ({ label: MENU_NAMES[p.slug] ?? p.name, href: `/${p.slug}/`, description: p.tagline }));

export const publisherProducts = byCategory('publishers');
export const buyerProducts = byCategory('buyers');

export const primaryNav = [
  {
    label: 'Products',
    href: '/products/',
    kind: 'mega' as const,
    columns: [
      { title: 'Publishers', href: '/ad-publishers-solutions/', links: publisherProducts },
      { title: 'Buyers', href: '/ad-buyers-solutions/', links: buyerProducts },
    ],
  },
  {
    label: 'Solutions',
    href: '/solutions/',
    kind: 'menu' as const,
    links: [
      { label: 'Solutions overview', href: '/solutions/', description: 'One platform, two sides of programmatic advertising.' },
      { label: 'For publishers', href: '/ad-publishers-solutions/', description: 'Monetize smarter. Create faster. Optimize everything.' },
      { label: 'For buyers', href: '/ad-buyers-solutions/', description: 'Plan smarter. Activate faster. Prove impact.' },
      { label: 'GAM 360', href: '/google-ad-manager-solutions-services/', description: 'Google Ad Manager 360 and Authorized Buyers services.' },
    ],
  },
  {
    label: 'Resources',
    href: '/resources/blog/',
    kind: 'menu' as const,
    links: [
      { label: 'Voise Blogs', href: '/resources/blog/', description: 'Perspectives on programmatic, CTV and agentic AI.' },
      { label: 'Events', href: '/resources/events/', description: 'Where the VoiseTech team has been and is heading.' },
      { label: 'Case Studies', href: '/resources/case-studies/', description: 'Campaign success stories from around the world.' },
      { label: 'Testimonials', href: '/resources/testimonials/', description: 'What our partners say about working with us.' },
    ],
  },
  {
    label: 'Company',
    href: '/about-us/',
    kind: 'menu' as const,
    links: [
      { label: 'About Us', href: '/about-us/', description: 'Built for transparency. Engineered for omnichannel performance.' },
      { label: 'Careers', href: '/careers/', description: 'Shape the future of programmatic. Grow with us.' },
      { label: 'Contact Us', href: '/contact-us/', description: 'Talk to the VoiseTech team.' },
    ],
  },
];

export const resourceTabs: NavLink[] = [
  { label: 'Voise Blogs', href: '/resources/blog/' },
  { label: 'Events', href: '/resources/events/' },
  { label: 'Case Studies', href: '/resources/case-studies/' },
  { label: 'Testimonials', href: '/resources/testimonials/' },
];

export const footerNav = [
  { title: 'Publishers', links: publisherProducts.map(({ label, href }) => ({ label, href })) },
  { title: 'Buyers', links: buyerProducts.map(({ label, href }) => ({ label, href })) },
  { title: 'Resources', links: resourceTabs },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about-us/' },
      { label: 'Solutions', href: '/solutions/' },
      { label: 'GAM 360', href: '/google-ad-manager-solutions-services/' },
      { label: 'VoiseTech.AI', href: '/voisetechai/' },
      { label: 'Careers', href: '/careers/' },
      { label: 'Contact Us', href: '/contact-us/' },
      { label: 'Login', href: '/login/' },
    ],
  },
];
