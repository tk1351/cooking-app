import React, { VFC } from 'react'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import axios from 'axios'
import Navbar from '../../../components/common/Navbar'
import EditRecipeForm from '../../../components/recipe/EditRecipeForm'
import { IRecipe } from '../../../re-ducks/recipe/type'

const recipeId: VFC<Props> = (props) => {
  return (
    <div>
      <Navbar />
      <EditRecipeForm recipe={props} />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const url = 'http://api:8080/recipes'
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
  const url = `http://api:8080/recipes/${Number(context.params?.recipeId)}`
  const res = await axios.get<IRecipe>(url)
  return {
    props: res.data,
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export default recipeId