import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { AppDispatch, AsyncThunkConfig } from '../store'
import { AuthState, User, LoginUser } from './type'
import { MyKnownError, RecipeLike, Social } from '../defaultType'
import { Recipe } from '../recipe/type'

const initialState: AuthState = {
  auth: {
    token: null,
    isAuthenticated: false,
    loading: true,
    user: null,
  },
  status: 'idle',
  error: null,
}

export const loginUser = createAsyncThunk<
  { accessToken: string; user: User },
  LoginUser,
  AsyncThunkConfig<MyKnownError[]>
>('auth/loginUser', async (userData, { rejectWithValue }) => {
  try {
    const url = '/api/users/login'
    const res = await axios.post<{
      id: number
      createdAt: Date
      updatedAt: Date
      accessToken: string
      name: string
      email: string
      role: 'admin' | 'user'
      favoriteDish: string
      specialDish: string
      bio: string
      recipes: Recipe[]
      recipeLikes: RecipeLike[]
      socials: Social[]
    }>(url, userData)
    const accessToken = res.data.accessToken
    localStorage.setItem('token', accessToken)

    const user = {
      id: res.data.id,
      createdAt: res.data.createdAt,
      updatedAt: res.data.updatedAt,
      name: res.data.name,
      email: res.data.email,
      role: res.data.role,
      favoriteDish: res.data.favoriteDish,
      specialDish: res.data.specialDish,
      bio: res.data.bio,
      recipes: res.data.recipes,
      recipeLikes: res.data.recipeLikes,
      socials: res.data.socials,
    }

    return { accessToken, user }
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // login
    builder.addCase(loginUser.pending, (state) => {
      state.status = 'loading'
    })
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.auth.token = action.payload.accessToken
      state.auth.user = action.payload.user
    })
    builder.addCase(loginUser.rejected, (state, action) => {
      if (action.payload) {
        state.status = 'failed'
        state.error = action.payload
      }
    })
  },
})

export default authSlice.reducer
