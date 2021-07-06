import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { IRecipeState, IRecipe, IUpdateRecipeInputs } from './type'
import { AsyncThunkConfig, RootState } from '../store'
import { MyKnownError, MyKnownMessage } from '../defaultType'
import { IRecipeData } from '../../components/form/type'
import { setAuthToken } from '../../src/utils/setAuthToken'

import API from '../../src/utils/api'

const initialState: IRecipeState = {
  recipe: null,
  recipes: [],
  loading: true,
  status: 'idle',
  error: null,
}

export const createRecipe = createAsyncThunk<
  IRecipe,
  IRecipeData,
  AsyncThunkConfig<MyKnownError>
>('recipe/createRecipe', async (recipeData, { rejectWithValue }) => {
  try {
    if (localStorage.token) {
      setAuthToken(localStorage.token)
    }
    const url = '/recipes'
    const res = await API.post<IRecipe>(url, recipeData)
    return res.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const likeRecipe = createAsyncThunk<
  MyKnownMessage,
  number,
  AsyncThunkConfig<MyKnownError>
>('recipe/likeRecipe', async (id, { rejectWithValue }) => {
  try {
    if (localStorage.token) {
      setAuthToken(localStorage.token)
    }
    const url = `/recipes/${id}/like`
    const res = await API.post<MyKnownMessage>(url, id)
    return res.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const updateRecipe = createAsyncThunk<
  IRecipe,
  { postData: IUpdateRecipeInputs; id: number },
  AsyncThunkConfig<MyKnownError>
>('recipe/updateRecipe', async ({ postData, id }, { rejectWithValue }) => {
  try {
    if (localStorage.token) {
      setAuthToken(localStorage.token)
    }
    const url = `/recipes/${id}`
    const res = await API.patch<IRecipe>(url, postData)
    return res.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const deleteRecipe = createAsyncThunk<
  { message: MyKnownMessage; id: number },
  number,
  AsyncThunkConfig<MyKnownError>
>('recipe/deleteRecipe', async (id, { rejectWithValue }) => {
  try {
    if (localStorage.token) {
      setAuthToken(localStorage.token)
    }
    const url = `/recipes/${id}`
    const res = await API.delete<MyKnownMessage>(url)
    return { message: res.data, id }
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const unlikeRecipe = createAsyncThunk<
  MyKnownMessage,
  number,
  AsyncThunkConfig<MyKnownError>
>('recipe/unlikeRecipe', async (id, { rejectWithValue }) => {
  try {
    if (localStorage.token) {
      setAuthToken(localStorage.token)
    }
    const url = `/recipes/${id}/unlike`
    const res = await API.delete<MyKnownMessage>(url)
    return res.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

const recipeSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // レシピを投稿する
    builder.addCase(createRecipe.pending, (state) => {
      state.status = 'loading'
    })
    builder.addCase(createRecipe.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.recipe = action.payload
      state.loading = false
      state.error = null
    })
    builder.addCase(createRecipe.rejected, (state, action) => {
      if (action.payload) {
        state.status = 'failed'
        state.recipe = null
        state.error = action.payload
        state.loading = false
      }
    })

    // お気に入りする
    builder.addCase(likeRecipe.pending, (state) => {
      state.status = 'loading'
    })
    builder.addCase(likeRecipe.fulfilled, (state) => {
      state.status = 'succeeded'
      state.loading = false
      state.error = null
    })
    builder.addCase(likeRecipe.rejected, (state, action) => {
      if (action.payload) {
        state.status = 'failed'
        state.loading = false
        state.error = action.payload
      }
    })

    // レシピを更新する
    builder.addCase(updateRecipe.pending, (state) => {
      state.status = 'loading'
    })
    builder.addCase(updateRecipe.fulfilled, (state) => {
      state.status = 'succeeded'
      state.loading = false
      state.error = null
    })
    builder.addCase(updateRecipe.rejected, (state, action) => {
      if (action.payload) {
        state.status = 'failed'
        state.loading = false
        state.error = action.payload
      }
    })

    // レシピを削除する
    builder.addCase(deleteRecipe.pending, (state) => {
      state.status = 'loading'
    })
    builder.addCase(deleteRecipe.fulfilled, (state, action) => {
      state.status = 'succeeded'
      const deleteRecipeIndex = state.recipes.findIndex(
        (recipe: IRecipe) => recipe.id === action.payload.id
      )
      state.recipes.splice(deleteRecipeIndex, 1)
      state.loading = false
      state.error = null
    })
    builder.addCase(deleteRecipe.rejected, (state, action) => {
      if (action.payload) {
        state.status = 'failed'
        state.error = action.payload
        state.loading = false
      }
    })

    // お気に入りを解除する
    builder.addCase(unlikeRecipe.pending, (state) => {
      state.status = 'loading'
    })
    builder.addCase(unlikeRecipe.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.loading = false
      state.error = null
    })
    builder.addCase(unlikeRecipe.rejected, (state, action) => {
      if (action.payload) {
        state.status = 'failed'
        state.loading = false
        state.error = action.payload
      }
    })
  },
})

export const selectRecipeLoading = (state: RootState) => state.recipe.loading
export const selectRecipes = (state: RootState) => state.recipe.recipes
export const selectRecipe = (state: RootState) => state.recipe.recipe

export default recipeSlice.reducer
