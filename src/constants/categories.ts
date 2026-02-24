export type CategoryType = 'expense' | 'income';

export interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
  type: CategoryType;
}

export interface HobbyTemplate {
  key: string;
  name: string;
  icon: string;
  color: string;
  categories: Category[];
}

export const HOBBY_TEMPLATES: HobbyTemplate[] = [
  {
    key: 'photography',
    name: 'Photography',
    icon: 'camera',
    color: '#8B4513',
    categories: [
      { id: 'camera-body', label: 'Camera Body', icon: 'camera', color: '#8B4513', type: 'expense' },
      { id: 'lenses', label: 'Lenses', icon: 'eye', color: '#A0522D', type: 'expense' },
      { id: 'lighting', label: 'Lighting', icon: 'bolt', color: '#B8860B', type: 'expense' },
      { id: 'accessories', label: 'Accessories', icon: 'briefcase', color: '#6B4E71', type: 'expense' },
      { id: 'software', label: 'Software', icon: 'laptop', color: '#2E5A88', type: 'expense' },
      { id: 'travel', label: 'Travel', icon: 'plane', color: '#4A766E', type: 'expense' },
      { id: 'studio', label: 'Studio', icon: 'home', color: '#8B3A3A', type: 'expense' },
      { id: 'printing', label: 'Printing', icon: 'print', color: '#696156', type: 'expense' },
      { id: 'education', label: 'Education', icon: 'graduation-cap', color: '#4A7C59', type: 'expense' },
      { id: 'client-work', label: 'Client Work', icon: 'users', color: '#1A1A1A', type: 'income' },
      { id: 'print-sales', label: 'Print Sales', icon: 'picture-o', color: '#2C4A2C', type: 'income' },
      { id: 'stock-photos', label: 'Stock Photos', icon: 'cloud-upload', color: '#2E5A88', type: 'income' },
      { id: 'workshops', label: 'Workshops', icon: 'group', color: '#8B7D37', type: 'income' },
      { id: 'licensing', label: 'Licensing', icon: 'file-text', color: '#6B4E71', type: 'income' },
      { id: 'events', label: 'Events', icon: 'calendar', color: '#A0522D', type: 'income' },
    ],
  },
  {
    key: 'music',
    name: 'Music',
    icon: 'music',
    color: '#2E5A88',
    categories: [
      { id: 'instruments', label: 'Instruments', icon: 'music', color: '#2E5A88', type: 'expense' },
      { id: 'gear', label: 'Gear & Pedals', icon: 'sliders', color: '#8B4513', type: 'expense' },
      { id: 'recording', label: 'Recording', icon: 'microphone', color: '#A0522D', type: 'expense' },
      { id: 'software', label: 'Software', icon: 'laptop', color: '#6B4E71', type: 'expense' },
      { id: 'lessons', label: 'Lessons', icon: 'graduation-cap', color: '#4A7C59', type: 'expense' },
      { id: 'sheet-music', label: 'Sheet Music', icon: 'file-text', color: '#696156', type: 'expense' },
      { id: 'maintenance', label: 'Maintenance', icon: 'wrench', color: '#B8860B', type: 'expense' },
      { id: 'studio-time', label: 'Studio Time', icon: 'home', color: '#8B3A3A', type: 'expense' },
      { id: 'gigs', label: 'Gigs', icon: 'star', color: '#1A1A1A', type: 'income' },
      { id: 'teaching', label: 'Teaching', icon: 'group', color: '#2C4A2C', type: 'income' },
      { id: 'streaming', label: 'Streaming', icon: 'cloud-upload', color: '#2E5A88', type: 'income' },
      { id: 'sales', label: 'Music Sales', icon: 'shopping-cart', color: '#8B7D37', type: 'income' },
      { id: 'licensing', label: 'Licensing', icon: 'file-text', color: '#6B4E71', type: 'income' },
    ],
  },
  {
    key: 'art',
    name: 'Art & Illustration',
    icon: 'paint-brush',
    color: '#A0522D',
    categories: [
      { id: 'supplies', label: 'Supplies', icon: 'paint-brush', color: '#A0522D', type: 'expense' },
      { id: 'canvas', label: 'Canvas & Paper', icon: 'file', color: '#8B4513', type: 'expense' },
      { id: 'software', label: 'Software', icon: 'laptop', color: '#2E5A88', type: 'expense' },
      { id: 'hardware', label: 'Hardware', icon: 'tablet', color: '#6B4E71', type: 'expense' },
      { id: 'framing', label: 'Framing', icon: 'square', color: '#696156', type: 'expense' },
      { id: 'courses', label: 'Courses', icon: 'graduation-cap', color: '#4A7C59', type: 'expense' },
      { id: 'studio', label: 'Studio', icon: 'home', color: '#8B3A3A', type: 'expense' },
      { id: 'commissions', label: 'Commissions', icon: 'users', color: '#1A1A1A', type: 'income' },
      { id: 'print-sales', label: 'Print Sales', icon: 'picture-o', color: '#2C4A2C', type: 'income' },
      { id: 'gallery', label: 'Gallery Sales', icon: 'bank', color: '#8B7D37', type: 'income' },
      { id: 'licensing', label: 'Licensing', icon: 'file-text', color: '#6B4E71', type: 'income' },
      { id: 'workshops', label: 'Workshops', icon: 'group', color: '#A0522D', type: 'income' },
    ],
  },
  {
    key: 'gaming',
    name: 'Gaming',
    icon: 'gamepad',
    color: '#4A766E',
    categories: [
      { id: 'hardware', label: 'Hardware', icon: 'desktop', color: '#4A766E', type: 'expense' },
      { id: 'peripherals', label: 'Peripherals', icon: 'gamepad', color: '#2E5A88', type: 'expense' },
      { id: 'games', label: 'Games', icon: 'th', color: '#8B4513', type: 'expense' },
      { id: 'subscriptions', label: 'Subscriptions', icon: 'refresh', color: '#6B4E71', type: 'expense' },
      { id: 'accessories', label: 'Accessories', icon: 'headphones', color: '#A0522D', type: 'expense' },
      { id: 'streaming-gear', label: 'Streaming Gear', icon: 'video-camera', color: '#696156', type: 'expense' },
      { id: 'events', label: 'Events & LAN', icon: 'ticket', color: '#8B3A3A', type: 'expense' },
      { id: 'streaming', label: 'Streaming', icon: 'cloud-upload', color: '#1A1A1A', type: 'income' },
      { id: 'tournaments', label: 'Tournaments', icon: 'trophy', color: '#2C4A2C', type: 'income' },
      { id: 'sponsorships', label: 'Sponsorships', icon: 'star', color: '#8B7D37', type: 'income' },
      { id: 'content', label: 'Content', icon: 'play-circle', color: '#2E5A88', type: 'income' },
    ],
  },
  {
    key: 'cooking',
    name: 'Cooking & Baking',
    icon: 'cutlery',
    color: '#8B3A3A',
    categories: [
      { id: 'ingredients', label: 'Ingredients', icon: 'shopping-basket', color: '#8B3A3A', type: 'expense' },
      { id: 'equipment', label: 'Equipment', icon: 'cutlery', color: '#8B4513', type: 'expense' },
      { id: 'cookware', label: 'Cookware', icon: 'fire', color: '#A0522D', type: 'expense' },
      { id: 'books', label: 'Cookbooks', icon: 'book', color: '#696156', type: 'expense' },
      { id: 'classes', label: 'Classes', icon: 'graduation-cap', color: '#4A7C59', type: 'expense' },
      { id: 'packaging', label: 'Packaging', icon: 'cube', color: '#6B4E71', type: 'expense' },
      { id: 'catering', label: 'Catering', icon: 'users', color: '#1A1A1A', type: 'income' },
      { id: 'bake-sales', label: 'Bake Sales', icon: 'shopping-cart', color: '#2C4A2C', type: 'income' },
      { id: 'teaching', label: 'Teaching', icon: 'group', color: '#8B7D37', type: 'income' },
      { id: 'content', label: 'Content', icon: 'play-circle', color: '#2E5A88', type: 'income' },
    ],
  },
  {
    key: 'fitness',
    name: 'Fitness & Training',
    icon: 'heartbeat',
    color: '#4A7C59',
    categories: [
      { id: 'equipment', label: 'Equipment', icon: 'heartbeat', color: '#4A7C59', type: 'expense' },
      { id: 'gym', label: 'Gym & Memberships', icon: 'home', color: '#8B4513', type: 'expense' },
      { id: 'apparel', label: 'Apparel', icon: 'shopping-bag', color: '#A0522D', type: 'expense' },
      { id: 'nutrition', label: 'Nutrition', icon: 'leaf', color: '#2C4A2C', type: 'expense' },
      { id: 'coaching', label: 'Coaching', icon: 'graduation-cap', color: '#6B4E71', type: 'expense' },
      { id: 'events', label: 'Events & Races', icon: 'ticket', color: '#8B3A3A', type: 'expense' },
      { id: 'recovery', label: 'Recovery', icon: 'medkit', color: '#2E5A88', type: 'expense' },
      { id: 'personal-training', label: 'Personal Training', icon: 'users', color: '#1A1A1A', type: 'income' },
      { id: 'class-instruction', label: 'Class Instruction', icon: 'group', color: '#8B7D37', type: 'income' },
      { id: 'sponsorships', label: 'Sponsorships', icon: 'star', color: '#696156', type: 'income' },
      { id: 'prizes', label: 'Prizes', icon: 'trophy', color: '#B8860B', type: 'income' },
    ],
  },
  {
    key: 'woodworking',
    name: 'Woodworking & Crafts',
    icon: 'wrench',
    color: '#696156',
    categories: [
      { id: 'tools', label: 'Tools', icon: 'wrench', color: '#696156', type: 'expense' },
      { id: 'materials', label: 'Materials', icon: 'cube', color: '#8B4513', type: 'expense' },
      { id: 'hardware', label: 'Hardware', icon: 'cog', color: '#A0522D', type: 'expense' },
      { id: 'finishes', label: 'Finishes', icon: 'paint-brush', color: '#B8860B', type: 'expense' },
      { id: 'workshop', label: 'Workshop', icon: 'home', color: '#8B3A3A', type: 'expense' },
      { id: 'safety', label: 'Safety Gear', icon: 'shield', color: '#4A7C59', type: 'expense' },
      { id: 'education', label: 'Education', icon: 'graduation-cap', color: '#6B4E71', type: 'expense' },
      { id: 'commissions', label: 'Commissions', icon: 'users', color: '#1A1A1A', type: 'income' },
      { id: 'product-sales', label: 'Product Sales', icon: 'shopping-cart', color: '#2C4A2C', type: 'income' },
      { id: 'market-sales', label: 'Market Sales', icon: 'calendar', color: '#8B7D37', type: 'income' },
      { id: 'workshops', label: 'Workshops', icon: 'group', color: '#2E5A88', type: 'income' },
    ],
  },
  {
    key: 'gardening',
    name: 'Gardening',
    icon: 'leaf',
    color: '#2C4A2C',
    categories: [
      { id: 'plants', label: 'Plants & Seeds', icon: 'leaf', color: '#2C4A2C', type: 'expense' },
      { id: 'soil', label: 'Soil & Compost', icon: 'cube', color: '#8B4513', type: 'expense' },
      { id: 'tools', label: 'Tools', icon: 'wrench', color: '#696156', type: 'expense' },
      { id: 'pots', label: 'Pots & Planters', icon: 'archive', color: '#A0522D', type: 'expense' },
      { id: 'irrigation', label: 'Irrigation', icon: 'tint', color: '#2E5A88', type: 'expense' },
      { id: 'structures', label: 'Structures', icon: 'home', color: '#8B3A3A', type: 'expense' },
      { id: 'education', label: 'Education', icon: 'graduation-cap', color: '#4A7C59', type: 'expense' },
      { id: 'produce-sales', label: 'Produce Sales', icon: 'shopping-basket', color: '#1A1A1A', type: 'income' },
      { id: 'plant-sales', label: 'Plant Sales', icon: 'leaf', color: '#2C4A2C', type: 'income' },
      { id: 'market', label: 'Farmers Market', icon: 'calendar', color: '#8B7D37', type: 'income' },
      { id: 'services', label: 'Services', icon: 'users', color: '#6B4E71', type: 'income' },
    ],
  },
];

export function getTemplateByKey(key: string): HobbyTemplate | undefined {
  return HOBBY_TEMPLATES.find((t) => t.key === key);
}
