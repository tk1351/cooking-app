export interface DefaultType {
  id: number
  createdAt: Date
  updatedAt: Date
}

export interface Ingredient extends DefaultType {
  name: string
  amount: string
  recipeId: number
}

export interface RecipeLike extends DefaultType {
  userId: number
  recipeId: number
}

export interface Tag extends DefaultType {
  name: string
  recipeId: number
}

export interface Social extends DefaultType {
  category: number
  url: string
}

export interface MyKnownError {
  message: string
}
