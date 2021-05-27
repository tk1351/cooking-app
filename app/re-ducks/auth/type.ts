import { DefaultType, RecipeLike, Social, MyKnownError } from '../defaultType'
import { Recipe } from '../recipe/type'

export interface User extends DefaultType {
  name: string
  email: string
  role: 'admin' | 'user'
  favoriteDish: string
  specialDish: string
  bio: string
  recipes: Recipe[]
  recipeLikes: RecipeLike[]
  socials: Social[]
}

export interface AuthState {
  auth: {
    token: string | null
    isAuthenticated: boolean
    loading: boolean
    user: User | null
  }
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: MyKnownError[] | null
}

export interface LoginUser {
  email: string
  password: string
}
