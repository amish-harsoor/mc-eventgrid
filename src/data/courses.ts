export interface Course {
  id: string;
  title: string;
  instructor: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  description: string;
}

export const CATEGORIES = [
  'All',
  'Leadership',
  'Strategy',
  'Operations',
  'Finance',
  'Marketing',
  'Human Resources',
  'Project Management'
];

export const COURSES: Course[] = [
  {
    id: '1',
    title: 'Strategic Leadership in the Modern Era',
    instructor: 'Dr. Sarah Chen',
    rating: 4.8,
    reviews: 1250,
    price: 89.99,
    image: 'https://picsum.photos/seed/leadership/800/600',
    category: 'Leadership',
    level: 'Advanced',
    duration: '12 hours',
    description: 'Master the art of leading high-performance teams in a rapidly changing global landscape.'
  },
  {
    id: '2',
    title: 'Financial Management for Non-Finance Managers',
    instructor: 'Michael Roberts',
    rating: 4.7,
    reviews: 850,
    price: 74.99,
    image: 'https://picsum.photos/seed/finance/800/600',
    category: 'Finance',
    level: 'Beginner',
    duration: '8 hours',
    description: 'Understand balance sheets, P&L statements, and financial decision-making without the jargon.'
  },
  {
    id: '3',
    title: 'Operations Excellence: Lean & Six Sigma',
    instructor: 'James Wilson',
    rating: 4.9,
    reviews: 2100,
    price: 99.99,
    image: 'https://picsum.photos/seed/operations/800/600',
    category: 'Operations',
    level: 'Intermediate',
    duration: '15 hours',
    description: 'Optimize your business processes for maximum efficiency and minimum waste.'
  },
  {
    id: '4',
    title: 'Agile Project Management Professional',
    instructor: 'Emma Thompson',
    rating: 4.6,
    reviews: 3200,
    price: 129.99,
    image: 'https://picsum.photos/seed/project/800/600',
    category: 'Project Management',
    level: 'Intermediate',
    duration: '20 hours',
    description: 'Learn the Scrum framework and Kanban methodologies to deliver projects faster.'
  },
  {
    id: '5',
    title: 'Marketing Strategy & Brand Positioning',
    instructor: 'David Lee',
    rating: 4.8,
    reviews: 940,
    price: 69.99,
    image: 'https://picsum.photos/seed/marketing/800/600',
    category: 'Marketing',
    level: 'Intermediate',
    duration: '10 hours',
    description: 'Build a brand that resonates and a strategy that converts in the digital age.'
  },
  {
    id: '6',
    title: 'Organizational Behavior & HR Management',
    instructor: 'Dr. Linda Garcia',
    rating: 4.7,
    reviews: 1100,
    price: 79.99,
    image: 'https://picsum.photos/seed/hr/800/600',
    category: 'Human Resources',
    level: 'Beginner',
    duration: '14 hours',
    description: 'Understand the human element of business and how to foster a positive culture.'
  }
];
