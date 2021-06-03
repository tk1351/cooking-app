import React, { VFC } from 'react'
import RecipeItem from './RecipeItem'
import { IRecipe } from '../../re-ducks/recipe/type'

type Props = {
  recipes: IRecipe[]
}

const Recipes: VFC<Props> = ({ recipes }) => {
  return (
    <div>
      <h1>レシピ一覧</h1>
      {recipes.map((recipe) => (
        <RecipeItem key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}

export default Recipes
