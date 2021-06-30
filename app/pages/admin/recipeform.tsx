import React, { VFC } from 'react'
import Navbar from '../../components/common/Navbar'
import RecipeForm from '../../components/recipe/RecipeForm'
import Footer from '../../components/common/Footer'

const recipeform: VFC = () => {
  return (
    <>
      <Navbar />
      <RecipeForm />
      <Footer />
    </>
  )
}

export default recipeform
