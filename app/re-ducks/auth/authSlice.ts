import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AsyncThunkConfig, RootState } from '../store'
import {
  IAuthState,
  IRegisterUser,
  IUpdateUserProfileInputs,
  IUser,
  IUpdateAdminProfileInputs,
  ICurrentUser,
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

import API from '../../src/utils/api'

export const fetchCurrentUser = createAsyncThunk<
  ICurrentUser,
  string,
  AsyncThunkConfig<MyKnownError>
>('auth/loadUser', async (accessToken, { rejectWithValue }) => {
  try {
    setAuthToken(accessToken)
    const url = '/auth'
    const res = await API.get<{
      id: number
      name: string
      role: 'admin' | 'user'
    }>(url)

    const { id, name, role } = res.data
    const currentUser = { user: { id, name, role }, accessToken }

    return currentUser
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
    const url = '/users/register'
    const res = await API.post<MyKnownMessage>(url, userData)
    return res.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const updateAdminProfile = createAsyncThunk<
  IUser,
  { profile: IUpdateAdminProfileInputs; id: number; accessToken: string },
  AsyncThunkConfig<MyKnownError>
>(
  'auth/updateAdminProfile',
  async ({ profile, id, accessToken }, { rejectWithValue }) => {
    try {
      setAuthToken(accessToken)
      const url = `/users/admin/${id}/profile`
      const res = await API.patch<IUser>(url, profile)
      return res.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateUserProfile = createAsyncThunk<
  IUser,
  { profile: IUpdateUserProfileInputs; id: number; accessToken: string },
  AsyncThunkConfig<MyKnownError>
>(
  'auth/updateUserProfile',
  async ({ profile, id, accessToken }, { rejectWithValue }) => {
    try {
      setAuthToken(accessToken)
      const url = `/users/user/${id}/profile`
      const res = await API.patch<IUser>(url, profile)
      return res.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const deleteUserWithAdminPriviledge = createAsyncThunk<
  MyKnownMessage,
  { id: number; accessToken: string },
  AsyncThunkConfig<MyKnownError>
>(
  'auth/deleteUserWithAdminPriviledge',
  async ({ id, accessToken }, { rejectWithValue }) => {
    try {
      setAuthToken(accessToken)
      const url = `/users/${id}/admin`
      const res = await API.delete<MyKnownMessage>(url)
      return res.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

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
    },
  },
  extraReducers: (builder) => {
    // tokenからユーザー情報を取得
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.status = 'loading'
    })
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.auth.user = action.payload.user
      state.auth.token = action.payload.accessToken
      state.auth.isAuthenticated = true
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
export const selectUserToken = (state: RootState) =>
  state.auth.auth.token as string

export default authSlice.reducer
