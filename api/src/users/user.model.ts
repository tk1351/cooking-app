export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'auth';
  favoriteDish: string;
  specialDish: string;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
}
