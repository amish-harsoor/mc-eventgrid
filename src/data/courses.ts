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

export const fetchCourses = async (): Promise<Course[]> => {
  const response = await fetch('http://localhost:8000/courses');
  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }
  return response.json();
};

export const fetchUserCourses = async (): Promise<Course[]> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  const response = await fetch('http://localhost:8000/user/courses', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user courses');
  }
  return response.json();
};
