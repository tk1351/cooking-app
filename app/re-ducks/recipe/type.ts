import { DefaultType, Ingredient, RecipeLike, Tag } from '../defaultType'
import { User } from '../auth/type'

export interface Recipe extends DefaultType {
  name: string
  time: 5 | 10 | 15 | 20 | 30 | 40 | 50 | 60
  remarks: string
  image: string
  user: User
  ingredients: Ingredient[]
  recipeLikes: RecipeLike[]
  tags: Tag[]
}
