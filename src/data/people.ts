/** Team and testimonials, as published on /about-us/ and /resources/testimonials/. */
/** Department order = display order on /meet-the-team/ (leadership is shown above all departments). */
export const departments = ['Product & Engineering', 'Design & Creative', 'Technical Operations', 'Operations', 'Partnerships', 'Marketing', 'Customer Success', 'Finance', 'People & Admin'] as const;
export type Department = (typeof departments)[number];

/** `photo` is optional: people without one get an initials avatar until a headshot is supplied. */
export type Person = { name: string; role: string; photo?: string; linkedin?: string; department?: Department };

export const leadership: Person[] = [
  { name: 'Sabarish Pillai', role: 'Founder & CEO', photo: '/wp-content/uploads/2026/06/Website-Employee-Photos-sabarish.png', linkedin: 'https://www.linkedin.com/in/sabarish-pillai/' },
  { name: 'Wahid Omer', role: 'Co-Founder & CCO', photo: '/wp-content/uploads/2026/02/Website-Employee-Photos-wahid-e1772113718641.png', linkedin: 'https://www.linkedin.com/in/wahidomerdatadrivenmarketing/' },
  { name: 'Jijesh Nambiar', role: 'Co-Founder & COO', photo: '/wp-content/uploads/2026/06/Website-Employee-Photos-Jijesh.png', linkedin: 'https://www.linkedin.com/in/jijeshnambiar87/' },
];

/**
 * Ordered by department, then seniority (managers first, interns last).
 * Roles from /about-us/ (original 10) and from LinkedIn profiles (added Oct 2026).
 */
export const team: Person[] = [
  { name: 'Gyan Raunak', role: 'VP Product & Engineering', department: 'Product & Engineering', photo: '/wp-content/uploads/2026/04/Gyan-Raunak.png', linkedin: 'https://www.linkedin.com/in/gyanraunak/' },
  { name: 'Anushree Fale', role: 'Engineering Manager', department: 'Product & Engineering', photo: '/wp-content/uploads/2026/07/Anushree-Fale.png', linkedin: 'https://www.linkedin.com/in/anushreefale/' },
  { name: 'Prapti Goel', role: 'Full Stack Engineer', department: 'Product & Engineering', photo: '/team/prapti-goel.webp', linkedin: 'https://www.linkedin.com/in/praptigoel/' },
  { name: 'Khushi Jain', role: 'Full Stack Engineer', department: 'Product & Engineering', photo: '/team/khushi-jain.webp', linkedin: 'https://www.linkedin.com/in/khushi-jain-4901621b8/' },
  { name: 'Anamya Shree', role: 'Back End Developer', department: 'Product & Engineering', photo: '/team/anamya-shree.webp', linkedin: 'https://www.linkedin.com/in/anamya-shree-949987265/' },
  { name: 'Divya Kardile', role: 'iOS Developer', department: 'Product & Engineering', photo: '/team/divya-kardile.webp', linkedin: 'https://www.linkedin.com/in/divya-kardile-254b54200/' },
  { name: 'Swapnil Pawar', role: 'QA Engineer', department: 'Product & Engineering', photo: '/team/swapnil-pawar.webp', linkedin: 'https://www.linkedin.com/in/swapnilgpawar/' },
  { name: 'Aakash Birhade', role: 'UI/UX Designer', department: 'Design & Creative', photo: '/team/aakash-birhade.webp', linkedin: 'https://www.linkedin.com/in/aakashbirhadex/' },
  { name: 'Saloni Deshmukh', role: 'AI Video Editor', department: 'Design & Creative', photo: '/team/saloni-deshmukh.webp', linkedin: 'https://www.linkedin.com/in/saloni-deshmukh-4561562a9/' },
  { name: 'Advait Anand', role: 'Tech Ops', department: 'Technical Operations', photo: '/team/advait-anand.webp', linkedin: 'https://www.linkedin.com/in/advait-anand03/' },
  { name: 'Ashwin Vinod', role: 'Technical Operations Engineer – Intern', department: 'Technical Operations' },
  { name: 'Yuvraj Munot', role: 'Senior Director', department: 'Operations', photo: '/wp-content/uploads/2026/01/yum-e1767799386172.jpg', linkedin: 'https://www.linkedin.com/in/yuvrajmunot83/' },
  { name: 'Victoria de la Calle Fernández', role: 'Senior Commercial Operations Manager', department: 'Operations', photo: '/wp-content/uploads/2026/04/Vic.png', linkedin: 'https://www.linkedin.com/in/victoria-de-la-calle/' },
  { name: 'Sushma Veggalam', role: 'Senior Account Manager', department: 'Operations', photo: '/wp-content/uploads/2025/12/Untitled-design-9-e1767800003538.png', linkedin: 'https://www.linkedin.com/in/sushma-veggalam/' },
  { name: 'Karim Hammoud', role: 'Director – Partnerships MENA', department: 'Partnerships', photo: '/team/karim-hammoud.webp' },
  { name: 'Kelly Hoang', role: 'Partnerships', department: 'Partnerships', photo: '/wp-content/uploads/2026/08/kelly.png', linkedin: 'https://www.linkedin.com/in/kelly-hoang1307/' },
  { name: 'Yatin Makkar', role: 'Marketing and Brand Manager', department: 'Marketing', photo: '/team/yatin-makkar.webp', linkedin: 'https://www.linkedin.com/in/yatin-makkar-800960167/' },
  { name: 'Malavika Balakrishnan', role: 'Marketing', department: 'Marketing', photo: '/wp-content/uploads/2025/12/4.png', linkedin: 'https://www.linkedin.com/in/malavika-balakrishnan-649069125/' },
  { name: 'Akanksha Joshi', role: 'Customer Success', department: 'Customer Success', photo: '/wp-content/uploads/2025/09/Akanksha-Joshi.jpg', linkedin: 'https://www.linkedin.com/in/akanksha-joshi-534136142/' },
  { name: 'Madhavi S', role: 'Finance Executive', department: 'Finance', photo: '/team/madhavi-s.webp', linkedin: 'https://www.linkedin.com/in/madhavisural/' },
  { name: 'Pallavi Gadhe', role: 'Human Resource', department: 'People & Admin', photo: '/wp-content/uploads/2026/07/Pallavi-Gadhe.png', linkedin: 'https://www.linkedin.com/in/pallavi-g-6607511a0/' },
  { name: 'Maayur Kulthe', role: 'Head of Admin & Procurement', department: 'People & Admin', photo: '/wp-content/uploads/2026/10/Website-Employee-Photos.png', linkedin: 'https://www.linkedin.com/in/maayur-kulthe-19411110b/' },
  { name: 'Dev Chavriya', role: 'Administrative Associate', department: 'People & Admin', photo: '/team/dev-chavriya.webp', linkedin: 'https://www.linkedin.com/in/dev-chavriya-b39838429/' },
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
