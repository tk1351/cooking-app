export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  favoriteDish: string;
  specialDish: string;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  admin = 'admin',
  auth = 'auth',
}
