import React, { VFC } from 'react'
import Navbar from '../../components/common/Navbar'
import RecipeForm from '../../components/recipe/RecipeForm'
import Footer from '../../components/common/Footer'
import WithAdmin from '../../src/utils/WithAdmin'

const recipeform: VFC = () => {
  return (
    <WithAdmin>
      <div>
        <Navbar />
        <RecipeForm />
        <Footer />
      </div>
    </WithAdmin>
  )
}

export default recipeform
