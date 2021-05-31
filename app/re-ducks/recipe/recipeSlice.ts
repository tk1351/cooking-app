import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { IRecipeState, IRecipe } from './type'
import { AsyncThunkConfig, RootState } from '../store'
import { MyKnownError } from '../defaultType'
import { IRecipeInputs } from '../../components/form/type'

const initialState: IRecipeState = {
  recipe: null,
  recipes: [],
  loading: true,
  status: 'idle',
  error: null,
}

export const fetchAllRecipes = createAsyncThunk<
  IRecipe[],
  void,
  AsyncThunkConfig<MyKnownError>
>('recipe/fetchAllRecipes', async (_, { rejectWithValue }) => {
  try {
    const url = '/api/recipes'
    const res = await axios.get<IRecipe[]>(url)
    return res.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const fetchRecipeById = createAsyncThunk<
  IRecipe,
  number,
  AsyncThunkConfig<MyKnownError>
>('recipe/fetchRecipeById', async (id, { rejectWithValue }) => {
  try {
    const url = `/api/recipes/${id}`
    const res = await axios.get<IRecipe>(url)
    return res.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

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

const recipeSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // 全てのレシピを取得する
    builder.addCase(fetchAllRecipes.pending, (state) => {
      state.status = 'loading'
    })
    builder.addCase(fetchAllRecipes.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.recipe = null
      state.recipes = action.payload
      state.loading = false
      state.error = null
    })
    builder.addCase(fetchAllRecipes.rejected, (state, action) => {
      if (action.payload) {
        state.status = 'failed'
        state.recipes = []
        state.error = action.payload
        state.loading = false
      }
    })
    // idが一致するレシピを取得する
    builder.addCase(fetchRecipeById.pending, (state) => {
      state.status = 'loading'
    })
    builder.addCase(fetchRecipeById.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.recipe = action.payload
      state.recipes = []
      state.loading = false
      state.error = null
    })
    builder.addCase(fetchRecipeById.rejected, (state, action) => {
      if (action.payload) {
        state.status = 'failed'
        state.error = action.payload
        state.loading = false
        state.recipe = null
      }
    })
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
  },
})

export const selectRecipeLoading = (state: RootState) => state.recipe.loading
export const selectAllRecipes = (state: RootState) => state.recipe.recipes
export const selectRecipe = (state: RootState) => state.recipe.recipe

export default recipeSlice.reducer
