import React, { VFC } from 'react'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import axios from 'axios'
import { IRecipe } from '../../../re-ducks/recipe/type'
import Navbar from '../../../components/common/Navbar'
import DeleteRecipe from '../../../components/admin/DeleteRecipe'
import Footer from '../../../components/common/Footer'
import WithAdmin from '../../../src/utils/WithAdmin'

const recipeId: VFC<Props> = (props) => {
  return (
    <WithAdmin>
      <div>
        <Navbar />
        <DeleteRecipe recipe={props} />
        <Footer />
      </div>
    </WithAdmin>
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
