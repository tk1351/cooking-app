import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { AsyncThunkConfig, RootState } from '../store'
import {
  IAuthState,
  ILoginUser,
  IRegisterUser,
  IUpdateUserProfileInputs,
  IUser,
  IUpdateAdminProfileInputs,
} from './type'
import { MyKnownError, MyKnownMessage } from '../defaultType'
import { setAuthToken } from '../../src/utils/setAuthToken'

const initialState: IAuthState = {
  auth: {
    token: null,
    isAuthenticated: false,
    loading: true,
    user: null,
  },
  status: 'idle',
  message: null,
  error: null,
}

export const fetchCurrentUser = createAsyncThunk<
  { id: number; name: string; role: 'admin' | 'user' },
  void,
  AsyncThunkConfig<MyKnownError>
>('auth/loadUser', async (_, { rejectWithValue }) => {
  try {
    if (localStorage.token) {
      setAuthToken(localStorage.token)
    }
    const url = '/api/auth'
    const res = await axios.get<{
      id: number
      name: string
      role: 'admin' | 'user'
    }>(url)
    return res.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const registerUser = createAsyncThunk<
  MyKnownMessage,
  IRegisterUser,
  AsyncThunkConfig<MyKnownError>
>('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const url = '/api/users/register'
    const res = await axios.post<MyKnownMessage>(url, userData)
    return res.data
  } catch (error) {
    localStorage.removeItem('token')
    return rejectWithValue(error.response.data)
  }
})

export const loginUser = createAsyncThunk<
  { accessToken: string },
  ILoginUser,
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

export const updateAdminProfile = createAsyncThunk<
  IUser,
  { profile: IUpdateAdminProfileInputs; id: number },
  AsyncThunkConfig<MyKnownError>
>('auth/updateAdminProfile', async ({ profile, id }, { rejectWithValue }) => {
  try {
    if (localStorage.token) {
      setAuthToken(localStorage.token)
    }
    const url = `/api/users/admin/${id}/profile`
    const res = await axios.patch<IUser>(url, profile)
    return res.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const updateUserProfile = createAsyncThunk<
  IUser,
  { profile: IUpdateUserProfileInputs; id: number },
  AsyncThunkConfig<MyKnownError>
>('auth/updateUserProfile', async ({ profile, id }, { rejectWithValue }) => {
  try {
    if (localStorage.token) {
      setAuthToken(localStorage.token)
    }
    const url = `/api/users/user/${id}/profile`
    const res = await axios.patch<IUser>(url, profile)
    return res.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const deleteUserWithAdminPriviledge = createAsyncThunk<
  MyKnownMessage,
  number,
  AsyncThunkConfig<MyKnownError>
>('auth/deleteUserWithAdminPriviledge', async (id, { rejectWithValue }) => {
  try {
    if (localStorage.token) {
      setAuthToken(localStorage.token)
    }
    const url = `/api/users/${id}/admin`
    const res = await axios.delete<MyKnownMessage>(url)
    return res.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.auth.token = null
      state.auth.user = null
      state.auth.isAuthenticated = false
      state.auth.loading = true
      state.status = 'idle'
      localStorage.removeItem('token')
    },
  },
  extraReducers: (builder) => {
    // tokenからユーザー情報を取得
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.status = 'loading'
    })
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.auth.token = localStorage.getItem('token')
      state.auth.isAuthenticated = true
      state.auth.user = action.payload
      state.auth.loading = false
    })
    builder.addCase(fetchCurrentUser.rejected, (state, action) => {
      if (action.payload) {
        state.status = 'failed'
        state.auth.token = null
        state.auth.user = null
        state.error = action.payload
        state.auth.isAuthenticated = false
        state.auth.loading = false
      }
    })

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

    // adminのプロフィール更新
    builder.addCase(updateAdminProfile.pending, (state) => {
      state.status = 'loading'
    })
    builder.addCase(updateAdminProfile.fulfilled, (state) => {
      state.status = 'succeeded'
    })
    builder.addCase(updateAdminProfile.rejected, (state, action) => {
      if (action.payload) {
        state.status = 'failed'
        state.error = action.payload
      }
    })

    // userのプロフィール更新
    builder.addCase(updateUserProfile.pending, (state) => {
      state.status = 'loading'
    })
    builder.addCase(updateUserProfile.fulfilled, (state) => {
      state.status = 'succeeded'
    })
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      if (action.payload) {
        state.status = 'failed'
        state.error = action.payload
      }
    })

    // admin権限でuserを削除
    builder.addCase(deleteUserWithAdminPriviledge.pending, (state) => {
      state.status = 'loading'
    })
    builder.addCase(deleteUserWithAdminPriviledge.fulfilled, (state) => {
      state.status = 'succeeded'
      state.auth.loading = false
    })
    builder.addCase(deleteUserWithAdminPriviledge.rejected, (state, action) => {
      if (action.payload) {
        state.status = 'failed'
        state.error = action.payload
        state.auth.loading = false
      }
    })
  },
})

export const { logout } = authSlice.actions

export const selectAuthLoading = (state: RootState) => state.auth.auth.loading
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.auth.isAuthenticated
export const selectUserRole = (state: RootState) => state.auth.auth.user?.role
export const selectUserId = (state: RootState) => state.auth.auth.user?.id

export default authSlice.reducer
