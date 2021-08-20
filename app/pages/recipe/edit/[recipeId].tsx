import React from 'react'
import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import axios from 'axios'
import Navbar from '../../../components/common/Navbar'
import EditRecipeForm from '../../../components/recipe/EditRecipeForm'
import { IRecipe } from '../../../re-ducks/recipe/type'
import Footer from '../../../components/common/Footer'

const recipeId: NextPage<Props> = (props) => {
  return (
    <div>
      <Navbar />
      <EditRecipeForm recipe={props} />
      <Footer />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const url = `${process.env.API_URL}/recipes`
  const res = await axios.get<[IRecipe[], number]>(url)
  const recipes = res.data[0]

  const paths = recipes.map((recipe) => ({
    params: { recipeId: recipe.id.toString() },
  }))

  return { paths, fallback: true }
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
