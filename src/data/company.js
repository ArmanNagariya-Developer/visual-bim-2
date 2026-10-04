/**
 * Visual BIM — company information.
 *
 * Contact details below are the official Visual BIM email and LinkedIn
 * page; they are consumed by the navbar, contact section, and footer.
 */
export const company = {
  name: 'Visual BIM',
  positioning: 'BIM Modeling & Digital Construction Solutions',
  tagline: 'Concept, rebuilt as an intelligent digital model.',
  mission:
    'Our mission is to deliver accurate, efficient, high-quality BIM solutions that improve project coordination, reduce costly errors, and accelerate construction workflows.',
  founded: 2026,
  email: {
    value: 'visualbim1@gmail.com',
    placeholder: false,
  },
  // International format without "+" or spaces — required by wa.me links.
  whatsapp: '919510565141',
  linkedin: {
    value: 'https://www.linkedin.com/company/viual-bim/',
    placeholder: false,
  },
  nav: [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ],
};

export const stats = [
  { value: '7', suffix: '', label: 'Specialised BIM services' },
  { value: 'LOD', suffix: ' 100–500', label: 'Model development range' },
  { value: '3', suffix: ' Disciplines', label: 'Architecture · Structure · MEP' },
  { value: '100', suffix: '%', label: 'Quality-checked deliverables' },
];
