/** Company facts used across the site. Source: www.voisetech.com footer, contact page and privacy policy. */
export const SITE = {
  name: 'Voise Tech',
  brand: 'VoiseTech',
  legalName: 'Voise Tech Ltd',
  url: 'https://www.voisetech.com',
  tagline: 'Beyond AdTech. Built for What’s Next.',
  description:
    'Power your campaigns with Voise Tech — a next-gen programmatic advertising platform offering advanced tools, automation & transparency for advertisers.',
  email: 'business@voisetech.com',
  address: {
    street: '4 Station Avenue',
    city: 'Coventry',
    postcode: 'CV4 9HS',
    country: 'United Kingdom',
    countryCode: 'GB',
  },
  linkedin: 'https://www.linkedin.com/company/voisetech/',
  youtube: 'https://www.youtube.com/@VoiseTech',
  presence: ['USA', 'UK', 'UAE', 'India'],
  logo: '/wp-content/uploads/2025/10/voise-tech-logo.webp',
  logoPng: '/wp-content/uploads/2025/07/voise-tech-logo.png',
  favicon: '/wp-content/uploads/2025/09/VT-Favicon.png',
  login: {
    publisher: 'https://login.voisetech.com/publisher/login',
    buyer: 'https://login.voisetech.com/advertiser/login',
  },
} as const;

export const mailto = (subject = 'Enquiry From Website') => `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`;

export const fullAddress = `${SITE.legalName}, ${SITE.address.street}, ${SITE.address.city} ${SITE.address.postcode}, ${SITE.address.country}`;
