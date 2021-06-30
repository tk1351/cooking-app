import { VFC } from 'react'
import { InferGetStaticPropsType } from 'next'
import axios from 'axios'
import Navbar from '../components/common/Navbar'
import Home from '../components/common/Home'
import { IRecipe } from '../re-ducks/recipe/type'
import Footer from '../components/common/Footer'

const index: VFC<Props> = (props) => {
  return (
    <>
      <Navbar />
      <Home {...props} />
      <Footer />
    </>
  )
}

export const getStaticProps = async () => {
  const limitNumber = 5
  const url = `http://api:8080/recipes/number?limit=${limitNumber}`
  const res = await axios.get<IRecipe[]>(url)
  return {
    props: { recipes: res.data },
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export default index
