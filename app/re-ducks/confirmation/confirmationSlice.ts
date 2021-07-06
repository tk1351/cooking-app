import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IConfimationState } from './type'
import { IRecipeInputs } from '../../components/form/type'
import { RootState } from '../store'

const initialState: IConfimationState = {
  recipe: {
    name: '',
    time: 5,
    remarks: '',
    ingredients: [
      {
        name: '',
        amount: '',
      },
    ],
    recipeDescriptions: [
      {
        order: 1,
        text: '',
        url: '',
      },
    ],
    tags: [{ name: '' }],
  },
}

export const confirmationSlice = createSlice({
  name: 'confirmation',
  initialState,
  reducers: {
    setRecipe: (state, action: PayloadAction<IRecipeInputs>) => {
      return { ...state, recipe: action.payload }
    },
    removeRecipe: (state) => {
      state.recipe = initialState.recipe
    },
  },
})

export const { setRecipe, removeRecipe } = confirmationSlice.actions
export const confirmRecipe = (state: RootState) => state.confirmation.recipe

export default confirmationSlice.reducer
