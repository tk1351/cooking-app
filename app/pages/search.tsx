import React, { VFC } from 'react'
import { GetServerSideProps } from 'next'
import axios from 'axios'
import Navbar from '../components/common/Navbar'
import Search from '../components/recipe/Search'
import { IRecipe } from '../re-ducks/recipe/type'

const search: VFC<{ recipes: IRecipe[] }> = (props) => {
  return (
    <div>
      <Navbar />
      <Search {...props} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = context.query.query
  const url = `http://api:8080/recipes?query=${query}`
  const res = await axios.get<IRecipe[]>(url)
  return {
    props: {
      recipes: res.data,
    },
  }
}

export default search