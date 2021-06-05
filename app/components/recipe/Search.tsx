import React, { VFC } from 'react'
import { IRecipe } from '../../re-ducks/recipe/type'
import RecipeItem from './RecipeItem'

type Props = {
  recipes: IRecipe[]
}

const Search: VFC<Props> = ({ recipes }) => {
  return (
    <div>
      <h1>検索結果：{recipes.length}件</h1>
      {recipes.map((recipe) => (
        <RecipeItem key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}

export default Search
