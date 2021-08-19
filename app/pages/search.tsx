import React, { VFC } from 'react'
import { GetServerSideProps } from 'next'
import axios from 'axios'
import Navbar from '../components/common/Navbar'
import Search from '../components/recipe/Search'
import { IRecipe } from '../re-ducks/recipe/type'
import Footer from '../components/common/Footer'

const search: VFC<{ recipes: IRecipe[] }> = (props) => {
  return (
    <div>
      <Navbar />
      <Search {...props} />
      <Footer />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const limitNumber = 5
  const start = 0

  const query = context.query.query as string
  const url = `${process.env.API_URL}/recipes?query=${encodeURI(
    query
  )}&start=${start}&limit=${limitNumber}`
  const res = await axios.get<[IRecipe[], number]>(url)
  const recipes = res.data[0]

  return {
    props: { recipes },
  }
}

export default search
