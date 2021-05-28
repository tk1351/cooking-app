import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { AsyncThunkConfig } from '../store'
import { AuthState, LoginUser, RegisterUser } from './type'
import { MyKnownError, MyKnownMessage } from '../defaultType'

const initialState: AuthState = {
  auth: {
    token: null,
    isAuthenticated: false,
    loading: true,
  },
  status: 'idle',
  message: null,
  error: null,
}

export const registerUser = createAsyncThunk<
  MyKnownMessage,
  RegisterUser,
  AsyncThunkConfig<MyKnownError>
>('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const url = '/api/users/register'
    const res = await axios.post<MyKnownMessage>(url, userData)
    const message: MyKnownMessage = { message: res.data.message }
    return message
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const loginUser = createAsyncThunk<
  { accessToken: string },
  LoginUser,
  AsyncThunkConfig<MyKnownError>
>('auth/loginUser', async (userData, { rejectWithValue }) => {
  try {
    const url = '/api/users/login'
    const res = await axios.post<{ accessToken: string }>(url, userData)
    const accessToken = res.data.accessToken
    localStorage.setItem('token', accessToken)

    return { accessToken }
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ユーザー登録
    builder.addCase(registerUser.pending, (state) => {
      state.status = 'loading'
    })
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.message = action.payload
      state.error = null
    })
    builder.addCase(registerUser.rejected, (state, action) => {
      if (action.payload) {
        state.status = 'failed'
        state.message = null
        state.error = action.payload
      }
    })
    // ログイン
    builder.addCase(loginUser.pending, (state) => {
      state.status = 'loading'
    })
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.auth.token = action.payload.accessToken
      state.auth.isAuthenticated = true
      state.auth.loading = false
      state.message = null
      state.error = null
    })
    builder.addCase(loginUser.rejected, (state, action) => {
      if (action.payload) {
        state.status = 'failed'
        state.message = null
        state.auth.token = null
        state.auth.isAuthenticated = false
        state.auth.loading = false
        state.error = action.payload
      }
    })
  },
})

export default authSlice.reducer
