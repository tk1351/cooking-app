import { VFC } from 'react'
import { GetServerSideProps } from 'next'
import axios from 'axios'
import Navbar from '../components/common/Navbar'
import Home from '../components/common/Home'
import { IRecipe } from '../re-ducks/recipe/type'
import Footer from '../components/common/Footer'

const index: VFC<{ recipes: IRecipe[] }> = (props) => {
  return (
    <>
      <Navbar />
      <Home {...props} />
      <Footer />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const limitNumber = 5
  const url = `${process.env.API_URL}/recipes/number?limit=${limitNumber}`
  const res = await axios.get<IRecipe[]>(url)
  return {
    props: { recipes: res.data },
  }
}

export default index
