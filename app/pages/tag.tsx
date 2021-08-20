import React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import axios from 'axios'
import { IRecipe } from '../re-ducks/recipe/type'
import Navbar from '../components/common/Navbar'
import Tag from '../components/recipe/Tag'
import Footer from '../components/common/Footer'

const tag: NextPage<{ recipes: IRecipe[]; count: number }> = (props) => {
  return (
    <div>
      <Navbar />
      <Tag {...props} />
      <Footer />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const limitNumber = 5
  const start = 0

  const tagName = context.query.name as string
  const url = `${process.env.API_URL}/recipes?tag=${encodeURI(
    tagName
  )}&start=${start}&limit=${limitNumber}`
  const res = await axios.get<[IRecipe[], number]>(url)
  const recipes = res.data[0]
  const count = res.data[1]

  return {
    props: { recipes, count },
  }
}

export default tag
