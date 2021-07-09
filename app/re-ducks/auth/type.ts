import {
  DefaultType,
  IRecipeLike,
  ISocial,
  MyKnownError,
  MyKnownMessage,
} from '../defaultType'
import { IRecipe } from '../recipe/type'

export interface IUser extends DefaultType {
  name: string
  email: string
  role: 'admin' | 'user'
  favoriteDish: string
  specialDish: string
  bio: string
  recipes: IRecipe[]
  recipeLikes: IRecipeLike[]
  socials: ISocial[]
}

export interface IAuthState {
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

export interface IRegisterUser {
  name: string
  email: string
  password: string
}

export interface ILoginUser {
  email: string
  password: string
}

export interface IUpdateAdminProfileInputs {
  name: string
  favoriteDish: string
  specialDish: string
  bio: string
  socials: ISocial[]
}

export interface IUpdateUserProfileInputs {
  name: string
  favoriteDish: string
  specialDish: string
}

export interface IRegisterInputs {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface ICurrentUser {
  user: {
    id: number
    name: string
    role: 'admin' | 'user'
  }
  accessToken: string
}
