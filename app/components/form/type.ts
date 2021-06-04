export interface IRecipeInputs {
  name: string
  time: 5 | 10 | 15 | 20 | 30 | 40 | 50 | 60
  remarks: string
  image: string
  ingredients: {
    name: string
    amount: string
  }[]
  recipeDescriptions: {
    order: number
    text: string
    url: string
  }[]
  tags: {
    name: string
  }[]
}
