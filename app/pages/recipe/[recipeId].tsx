import React, { VFC } from 'react'
import { GetStaticPaths, InferGetStaticPropsType, GetStaticProps } from 'next'
import axios from 'axios'
import Recipe from '../../components/recipe/Recipe'
import Navbar from '../../components/common/Navbar'
import { IRecipe } from '../../re-ducks/recipe/type'
import Footer from '../../components/common/Footer'

const recipeId: VFC<Props> = (props) => {
  return (
    <>
      <Navbar />
      <Recipe recipe={props} />
      <Footer />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const url = `${process.env.API_URL}/recipes`
  const res = await axios.get<IRecipe[]>(url)
  const recipes = await res.data

  const paths = recipes.map((recipe) => ({
    params: { recipeId: recipe.id.toString() },
  }))

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<
  IRecipe,
  { recipeId: string }
> = async (context) => {
  const url = `${process.env.API_URL}/recipes/${Number(
    context.params?.recipeId
  )}`
  const res = await axios.get<IRecipe>(url)
  return {
    props: res.data,
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export default recipeId
