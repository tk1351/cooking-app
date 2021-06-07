import { IRecipe } from './recipe/type'

export interface DefaultType {
  id: number
  createdAt: Date
  updatedAt: Date
}

export interface IIngredient extends DefaultType {
  name: string
  amount: string
  recipeId: number
}

export interface IRecipeDescription extends DefaultType {
  order: number
  text: string
  url: string
}

export interface IRecipeLike extends DefaultType {
  userId: number
  recipeId: number
  recipe: IRecipe
}

export interface ITag extends DefaultType {
  name: string
  recipeId: number
}

export interface ISocial extends DefaultType {
  category: number
  url: string
}

export interface MyKnownMessage {
  message: string
}

export interface MyKnownError {
  statusCode: number
  message: string[] | string
  error: string
}
