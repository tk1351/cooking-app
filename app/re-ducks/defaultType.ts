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

export interface IRecipeLike extends DefaultType {
  userId: number
  recipeId: number
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
