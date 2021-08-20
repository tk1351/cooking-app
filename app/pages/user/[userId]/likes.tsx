import React from 'react'
import {
  InferGetStaticPropsType,
  GetStaticPaths,
  GetStaticProps,
  NextPage,
} from 'next'
import axios from 'axios'
import Navbar from '../../../components/common/Navbar'
import Likes from '../../../components/user/Likes'
import { IRecipeLike } from '../../../re-ducks/defaultType'
import Footer from '../../../components/common/Footer'
import WithUser from '../../../src/utils/WithUser'

const likes: NextPage<Props> = (props) => {
  return (
    <WithUser>
      <div>
        <Navbar />
        <Likes {...props} />
        <Footer />
      </div>
    </WithUser>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const url = `${process.env.API_URL}/recipe-likes`
  const res = await axios.get<IRecipeLike[]>(url)
  const recipeLikes = res.data

  const paths = recipeLikes.map((recipeLike) => ({
    params: { userId: recipeLike.userId.toString() },
  }))

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<
  { recipeLikes: IRecipeLike[]; count: number },
  { userId: string }
> = async (context) => {
  const limitNumber = 5
  const start = 0

  const url = `${process.env.API_URL}/recipe-likes/${Number(
    context.params?.userId
  )}/user?start=${start}&limit=${limitNumber}`
  const res = await axios.get<[IRecipeLike[], number]>(url)
  const recipeLikes = res.data[0]
  const count = res.data[1]

  return {
    props: { recipeLikes, count },
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export default likes
