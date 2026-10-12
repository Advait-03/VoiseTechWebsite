/** Team and testimonials, as published on /about-us/ and /resources/testimonials/. */
export type Person = { name: string; role: string; photo: string; linkedin?: string };

export const leadership: Person[] = [
  { name: 'Sabarish Pillai', role: 'Founder & CEO', photo: '/wp-content/uploads/2026/06/Website-Employee-Photos-sabarish.png', linkedin: 'https://www.linkedin.com/in/sabarish-pillai/' },
  { name: 'Wahid Omer', role: 'Co-Founder & CCO', photo: '/wp-content/uploads/2026/02/Website-Employee-Photos-wahid-e1772113718641.png', linkedin: 'https://www.linkedin.com/in/wahidomerdatadrivenmarketing/' },
  { name: 'Jijesh Nambiar', role: 'Co-Founder & COO', photo: '/wp-content/uploads/2026/06/Website-Employee-Photos-Jijesh.png', linkedin: 'https://www.linkedin.com/in/jijeshnambiar87/' },
];

export const team: Person[] = [
  { name: 'Gyan Raunak', role: 'Product & Engineering', photo: '/wp-content/uploads/2026/04/Gyan-Raunak.png', linkedin: 'https://www.linkedin.com/in/gyanraunak/' },
  { name: 'Victoria de la Calle Fernandez', role: 'Partnerships', photo: '/wp-content/uploads/2026/04/Vic.png', linkedin: 'https://www.linkedin.com/in/victoria-de-la-calle/' },
  // The live page links Yuvraj Munot to Maayur Kulthe's LinkedIn profile; the link is
  // withheld until the correct profile is confirmed (docs/REVIEW-ITEMS.md).
  { name: 'Yuvraj Munot', role: 'Operations', photo: '/wp-content/uploads/2026/01/yum-e1767799386172.jpg' },
  { name: 'Maayur Kulthe', role: 'Admin & Procurement', photo: '/wp-content/uploads/2026/10/Website-Employee-Photos.png', linkedin: 'https://www.linkedin.com/in/maayur-kulthe-19411110b/' },
  { name: 'Akanksha Joshi', role: 'Customer Success', photo: '/wp-content/uploads/2025/09/Akanksha-Joshi.jpg', linkedin: 'https://www.linkedin.com/in/akanksha-joshi-534136142/' },
  { name: 'Malavika Balakrishnan', role: 'Marketing', photo: '/wp-content/uploads/2025/12/4.png', linkedin: 'https://www.linkedin.com/in/malavika-balakrishnan-649069125/' },
  { name: 'Sushma Veggalam', role: 'Operations', photo: '/wp-content/uploads/2025/12/Untitled-design-9-e1767800003538.png', linkedin: 'https://www.linkedin.com/in/sushma-veggalam/' },
  { name: 'Pallavi Gadhe', role: 'Human Resource', photo: '/wp-content/uploads/2026/07/Pallavi-Gadhe.png', linkedin: 'https://www.linkedin.com/in/pallavi-g-6607511a0/' },
  { name: 'Anushree Fale', role: 'Engineering', photo: '/wp-content/uploads/2026/07/Anushree-Fale.png', linkedin: 'https://www.linkedin.com/in/anushreefale/' },
  { name: 'Kelly Hoang', role: 'Partnerships', photo: '/wp-content/uploads/2026/08/kelly.png', linkedin: 'https://www.linkedin.com/in/kelly-hoang1307/' },
];

export type Testimonial = { name: string; role: string; company: string; quote: string; logo: string };

export const testimonials: Testimonial[] = [
  {
    name: 'Dinesh Joshi',
    role: 'VP',
    company: 'NDTV',
    logo: '/wp-content/uploads/2025/11/Articles-Feature-Image-Grid-551-x-355px-7.png',
    quote:
      'Our partnership with Voise Tech has been outstanding. Their deep industry expertise, operational excellence, and consistent delivery have significantly contributed to our business goals. They demonstrate reliability, transparency, and a strong commitment to quality outcomes. We highly value this partnership and look forward to our success together.',
  },
  {
    name: 'Suleyman Karadeniz',
    role: 'CEO',
    company: 'Adbreak',
    logo: '/wp-content/uploads/2025/09/logo1.jpg',
    quote:
      'Our journey with Voise Tech has been built on mutual respect, shared vision, and a genuine commitment to success. They understand our goals, adapt to our needs, and consistently deliver solutions that help Adbreak thrive. It’s rare to find a partner who feels like an extension of your own team — Voise Tech is exactly that.',
  },
  {
    name: 'Anushrav Gulati',
    role: 'Chief Digital Officer',
    company: 'TV9 Network',
    logo: '/wp-content/uploads/2025/09/logo2.jpg',
    quote:
      'Voise Tech has become a trusted partner in our digital growth journey. Their technology and data-driven approach have helped us maximize the efficiency of our ad inventory and deliver measurable results for our advertisers. We appreciate their commitment to collaboration and the way they tailor solutions to meet our evolving needs.',
  },
  {
    name: 'Michael Weaver',
    role: 'Senior Vice President',
    company: 'Al Jazeera Media Network',
    logo: '/wp-content/uploads/2025/09/logo3.jpg',
    quote:
      'Partnering with Voise Tech has been a great experience for us. Their programmatic expertise and innovative ad-serving solutions have enabled us to explore new revenue streams while maintaining the premium quality our network is known for. The team’s professionalism, speed of execution, and focus on transparency set them apart in the industry.',
  },
];
