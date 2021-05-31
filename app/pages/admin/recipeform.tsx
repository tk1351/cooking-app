import React, { VFC } from 'react'
import Navbar from '../../components/common/Navbar'
import RecipeForm from '../../components/recipe/RecipeForm'

const recipeform: VFC = () => {
  return (
    <>
      <Navbar />
      <RecipeForm />
    </>
  )
}

export default recipeform
