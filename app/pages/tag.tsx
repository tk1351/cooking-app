import React, { VFC } from 'react'
import { GetServerSideProps } from 'next'
import axios from 'axios'
import { IRecipe } from '../re-ducks/recipe/type'
import Navbar from '../components/common/Navbar'
import Tag from '../components/recipe/Tag'
import Footer from '../components/common/Footer'

const tag: VFC<{ recipes: IRecipe[] }> = (props) => {
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

  const tagName = context.query.name as string
  const url = `https://glacial-waters-79944.herokuapp.com/recipes/tag?name=${encodeURI(
    tagName
  )}&limit=${limitNumber}`
  const res = await axios.get<IRecipe[]>(url)
  return {
    props: {
      recipes: res.data,
    },
  }
}

export default tag
