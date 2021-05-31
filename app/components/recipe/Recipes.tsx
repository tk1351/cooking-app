import React, { VFC, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../re-ducks/hooks'
import {
  fetchAllRecipes,
  selectAllRecipes,
  selectRecipeLoading,
} from '../../re-ducks/recipe/recipeSlice'
import RecipeItem from './RecipeItem'

const Recipes: VFC = () => {
  const dispatch = useAppDispatch()

  const recipes = useAppSelector(selectAllRecipes)
  const loading = useAppSelector(selectRecipeLoading)

  useEffect(() => {
    dispatch(fetchAllRecipes())
  }, [])

  return (
    <div>
      {loading ? (
        <>読み込み中</>
      ) : (
        <>
          <h1>レシピ一覧</h1>
          {recipes.map((recipe) => (
            <RecipeItem key={recipe.id} recipe={recipe} />
          ))}
        </>
      )}
    </div>
  )
}

export default Recipes
