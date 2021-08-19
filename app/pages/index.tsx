import { GetServerSideProps, NextPage } from 'next'
import axios from 'axios'
import Navbar from '../components/common/Navbar'
import Home from '../components/common/Home'
import { IRecipe } from '../re-ducks/recipe/type'
import Footer from '../components/common/Footer'

const index: NextPage<{ recipes: IRecipe[]; count: number }> = (props) => {
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
  const start = 0
  const url = `${process.env.API_URL}/recipes?start=${start}&limit=${limitNumber}`
  const res = await axios.get<[IRecipe[], number]>(url)
  const recipes = res.data[0]
  const count = res.data[1]

  return {
    props: { recipes, count },
  }
}

export default index
