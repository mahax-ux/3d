import or from '../assets/images/or.png';
import mr from '../assets/images/mr.png';
import arr from '../assets/images/arr.png';
import we from '../assets/images/we.png';


export const IMAGES = [
  

  { 
    id: 'ignis-striker',
    src: or,
    bg: '#F4845F', panel: '#F79B7F',
    name: 'Bravos Ultimate Edition', price: 1149.00,
    desc: 'Step into effortless style and all-day comfort with the Bravos Ultimate Edition. Engineered as the ultimate anywhere-wear shoe, this versatile footwear seamlessly transitions from your morning commute to weekend outings',
    features: ['Trendy', 'Comfort', 'Stylish']
  },
  { 
    id: 'verdant-scout',
    src: mr, 
    bg: '#6BBF7A', panel: '#85CC92',
    name: 'Valar Murgholis', price: 2129.00,
    desc: 'Dominate the pitch and outpace the competition with these elite sports football shoes. Engineered for maximum agility and explosive speed, they feature a precision-textured upper for ultimate ball control and touch',
    features: ['Claasic', 'Soft-feel', 'Artistic']
  },
  { 
    id: 'neon-bubble',
    src: arr, 
    bg: '#E882B4', panel: '#ED9DC4',
    name: 'Joga Bonito', price: 1539.00,
    desc: 'Popping with attitude. Neon Bubble brings retro-futuristic vibes with translucent resin elements that catch the light perfectly.',
    features: ['Retro', 'sporty look ', 'Light weight']
  },
  { 
    id: 'aqua-drifter',
    src: we, 
    bg: '#6EB5FF', panel: '#8DC4FF',
    name: 'Hawkins', price: 6159.00,
    desc: 'Sleek, aerodynamic, and cool as ice. The Aqua Drifter figurine features a dynamic mid-air pose supported by a crystal-clear stand.',
    features: ['Leather coated', 'Handmade', 'Colorful']
  },
];

export const GRAIN_BG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter><rect width="200" height="200" filter="url(%23noise)" opacity="0.08"/></svg>`;
export const TRANSITION_BEZIER = '650ms cubic-bezier(0.4, 0, 0.2, 1)';
export const CAROUSEL_TRANSITIONS = `transform ${TRANSITION_BEZIER}, filter ${TRANSITION_BEZIER}, opacity ${TRANSITION_BEZIER}, left ${TRANSITION_BEZIER}, height ${TRANSITION_BEZIER}, bottom ${TRANSITION_BEZIER}`;