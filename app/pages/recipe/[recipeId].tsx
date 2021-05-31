import React, { VFC } from 'react'
import Recipe from '../../components/recipe/Recipe'
import Navbar from '../../components/common/Navbar'

const recipeId: VFC = () => {
  return (
    <div>
      <Navbar />
      <Recipe />
    </div>
  )
}

export default recipeId
