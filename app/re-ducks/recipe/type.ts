import {
  DefaultType,
  IIngredient,
  IRecipeLike,
  ITag,
  MyKnownError,
} from '../defaultType'
import { IUser } from '../auth/type'

export interface IRecipe extends DefaultType {
  name: string
  time: 5 | 10 | 15 | 20 | 30 | 40 | 50 | 60
  remarks: string
  image: string
  user: IUser
  ingredients: IIngredient[]
  recipeLikes: IRecipeLike[]
  tags: ITag[]
}

export interface IRecipeState {
  recipe: IRecipe | null
  recipes: IRecipe[]
  loading: boolean
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: MyKnownError | null
}
