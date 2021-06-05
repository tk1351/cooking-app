import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { IRecipeState, IRecipe, IUpdateRecipeInputs } from './type'
import { AsyncThunkConfig, RootState } from '../store'
import { MyKnownError, MyKnownMessage } from '../defaultType'
import { IRecipeInputs } from '../../components/form/type'

const initialState: IRecipeState = {
  recipe: null,
  recipes: [],
  loading: true,
  status: 'idle',
  error: null,
}

export const createRecipe = createAsyncThunk<
  IRecipe,
  IRecipeInputs,
  AsyncThunkConfig<MyKnownError>
>('recipe/createRecipe', async (recipeData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token')
    const url = '/api/recipes'
    const res = await axios.post<IRecipe>(url, recipeData, {
      headers: { Authorization: `Bearer ${token}` },
    })
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
    const token = localStorage.getItem('token')
    const url = `/api/recipes/${id}`
    const res = await axios.patch<IRecipe>(url, postData, {
      headers: { Authorization: `Bearer ${token}` },
    })
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
    const token = localStorage.getItem('token')
    const url = `/api/recipes/${id}`
    const res = await axios.delete<MyKnownMessage>(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return { message: res.data, id }
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
    // レシピを更新する
    builder.addCase(updateRecipe.pending, (state) => {
      state.status = 'loading'
    })
    builder.addCase(updateRecipe.fulfilled, (state) => {
      state.status = 'succeeded'
    })
    builder.addCase(updateRecipe.rejected, (state) => {
      state.status = 'failed'
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
  },
})

export const selectRecipeLoading = (state: RootState) => state.recipe.loading
export const selectRecipes = (state: RootState) => state.recipe.recipes
export const selectRecipe = (state: RootState) => state.recipe.recipe

export default recipeSlice.reducer
