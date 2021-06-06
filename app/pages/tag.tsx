import React, { VFC } from 'react'
import { GetServerSideProps } from 'next'
import axios from 'axios'
import { IRecipe } from '../re-ducks/recipe/type'
import Navbar from '../components/common/Navbar'
import Tag from '../components/recipe/Tag'

const tag: VFC<{ recipes: IRecipe[] }> = (props) => {
  return (
    <div>
      <Navbar />
      <Tag {...props} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tagName = context.query.name as string
  const url = `http://api:8080/recipes/tag?name=${encodeURI(tagName)}`
  const res = await axios.get<IRecipe[]>(url)
  return {
    props: {
      recipes: res.data,
    },
  }
}

export default tag
