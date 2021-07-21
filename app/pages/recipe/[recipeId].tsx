import React, { VFC } from 'react'
import { GetServerSideProps } from 'next'
import axios from 'axios'
import Recipe from '../../components/recipe/Recipe'
import Navbar from '../../components/common/Navbar'
import { IRecipe } from '../../re-ducks/recipe/type'
import Footer from '../../components/common/Footer'

const recipeId: VFC<{ recipe: IRecipe }> = (props) => {
  return (
    <>
      <Navbar />
      <Recipe {...props} />
      <Footer />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.recipeId
  const url = `${process.env.API_URL}/recipes/${Number(id)}`
  const res = await axios.get<IRecipe>(url)
  return {
    props: {
      recipe: res.data,
    },
  }
}

export default recipeId
