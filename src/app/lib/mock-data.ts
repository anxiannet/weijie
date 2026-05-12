import { PlaceHolderImages } from './placeholder-images';

export type Housing = {
  id: string;
  title: string;
  price: number;
  location: string;
  distanceToUni: string;
  type: string;
  imageUrl: string;
};

export type School = {
  id: string;
  name: string;
  description: string;
  rank: string;
  services: string[];
  imageUrl: string;
};

export type Food = {
  id: string;
  name: string;
  category: string;
  priceRange: string;
  location: string;
  rating: number;
  imageUrl: string;
};

export type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  imageUrl: string;
};

export const HOUSING_MOCK: Housing[] = [
  { id: 'h1', title: 'Luxury Condo @ One North', price: 1800, location: 'Kent Ridge', distanceToUni: '5 mins to NUS', type: 'Master Room', imageUrl: PlaceHolderImages.find(p => p.id === 'h-1')?.imageUrl || 'https://picsum.photos/seed/h1/800/600' },
  { id: 'h2', title: 'Cosy Studio near NTU', price: 1200, location: 'Jurong West', distanceToUni: '10 mins to NTU', type: 'Studio', imageUrl: PlaceHolderImages.find(p => p.id === 'h-2')?.imageUrl || 'https://picsum.photos/seed/h2/800/600' },
  { id: 'h3', title: 'Premium Co-living Space', price: 1500, location: 'Outram Park', distanceToUni: '15 mins to SMU', type: 'Common Room', imageUrl: PlaceHolderImages.find(p => p.id === 'h-3')?.imageUrl || 'https://picsum.photos/seed/h3/800/600' },
  { id: 'h4', title: 'HDB Executive Apartment', price: 900, location: 'Boon Lay', distanceToUni: '8 mins to NTU', type: 'Shared Room', imageUrl: PlaceHolderImages.find(p => p.id === 'h-4')?.imageUrl || 'https://picsum.photos/seed/h4/800/600' },
  { id: 'h5', title: 'Skyline View Residence', price: 2500, location: 'Marina Bay', distanceToUni: '20 mins to NUS', type: 'Whole Unit', imageUrl: PlaceHolderImages.find(p => p.id === 'h-5')?.imageUrl || 'https://picsum.photos/seed/h5/800/600' },
];

export const SCHOOLS_MOCK: School[] = [
  { id: 's1', name: 'National University of Singapore (NUS)', description: 'Singapore flagship university with global rankings.', rank: 'QS #8', services: ['Orientation', 'Visa Support', 'Alumni Network'], imageUrl: PlaceHolderImages.find(p => p.id === 's-1')?.imageUrl || 'https://picsum.photos/seed/s1/800/600' },
  { id: 's2', name: 'Nanyang Technological University (NTU)', description: 'World-renowned engineering and tech-focused campus.', rank: 'QS #15', services: ['Career Hub', 'Mental Wellness', 'Housing Office'], imageUrl: PlaceHolderImages.find(p => p.id === 's-2')?.imageUrl || 'https://picsum.photos/seed/s2/800/600' },
  { id: 's3', name: 'Singapore Management University (SMU)', description: 'City-campus focusing on business and social sciences.', rank: 'QS #445', services: ['Global Exchange', 'Incubation Lab', 'Academic Advisory'], imageUrl: PlaceHolderImages.find(p => p.id === 's-3')?.imageUrl || 'https://picsum.photos/seed/s3/800/600' },
];

export const FOOD_MOCK: Food[] = [
  { id: 'f1', name: 'Haidilao Hot Pot (海底捞)', category: 'Hot Pot', priceRange: '$$$', location: 'Clarke Quay', rating: 4.9, imageUrl: PlaceHolderImages.find(p => p.id === 'f-1')?.imageUrl || 'https://picsum.photos/seed/f1/800/600' },
  { id: 'f2', name: 'A-One Claypot House', category: 'Chinese Cuisine', priceRange: '$$', location: 'Jurong Point', rating: 4.5, imageUrl: PlaceHolderImages.find(p => p.id === 'f-2')?.imageUrl || 'https://picsum.photos/seed/f2/800/600' },
  { id: 'f3', name: 'Crystal Jade Hong Kong Kitchen', category: 'Dim Sum', priceRange: '$$', location: 'Orchard', rating: 4.3, imageUrl: PlaceHolderImages.find(p => p.id === 'f-3')?.imageUrl || 'https://picsum.photos/seed/f3/800/600' },
  { id: 'f4', name: 'Tanyao Fish Hotpot (探鱼)', category: 'Grilled Fish', priceRange: '$$', location: 'Westgate', rating: 4.7, imageUrl: PlaceHolderImages.find(p => p.id === 'f-4')?.imageUrl || 'https://picsum.photos/seed/f4/800/600' },
  { id: 'f5', name: 'MALA Xiang Guo (NTU Canteen)', category: 'Mala', priceRange: '$', location: 'NTU Canteen 1', rating: 4.2, imageUrl: PlaceHolderImages.find(p => p.id === 'f-5')?.imageUrl || 'https://picsum.photos/seed/f5/800/600' },
];

export const EVENTS_MOCK: Event[] = [
  { id: 'e1', title: 'Chinese New Year Gala', date: '2024-02-10', time: '18:00', location: 'MBS Ballroom', attendees: 500, imageUrl: PlaceHolderImages.find(p => p.id === 'e-1')?.imageUrl || 'https://picsum.photos/seed/e1/800/600' },
  { id: 'e2', title: 'Singapore Career Fair for Int Students', date: '2024-03-15', time: '10:00', location: 'Suntec Convention', attendees: 1200, imageUrl: PlaceHolderImages.find(p => p.id === 'e-2')?.imageUrl || 'https://picsum.photos/seed/e2/800/600' },
  { id: 'e3', title: 'Marina Bay Night Walk & Shoot', date: '2024-04-05', time: '19:30', location: 'Marina Bay Sands', attendees: 50, imageUrl: PlaceHolderImages.find(p => p.id === 'e-3')?.imageUrl || 'https://picsum.photos/seed/e3/800/600' },
];
