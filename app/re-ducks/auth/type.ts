import {
  DefaultType,
  RecipeLike,
  Social,
  MyKnownError,
  MyKnownMessage,
} from '../defaultType'
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
    user: { id: number; name: string; role: 'admin' | 'user' } | null
  }
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  message: MyKnownMessage | null
  error: MyKnownError | null
}

export interface RegisterUser {
  name: string
  email: string
  password: string
}

export interface LoginUser {
  email: string
  password: string
}
