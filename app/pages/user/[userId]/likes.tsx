import React, { VFC } from 'react'
import { InferGetStaticPropsType, GetStaticPaths, GetStaticProps } from 'next'
import axios from 'axios'
import Navbar from '../../../components/common/Navbar'
import Likes from '../../../components/user/Likes'
import { IRecipeLike } from '../../../re-ducks/defaultType'
import Footer from '../../../components/common/Footer'
import WithUser from '../../../src/utils/WithUser'

const likes: VFC<Props> = (props) => {
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

  return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps<
  { recipeLikes: IRecipeLike[] },
  { userId: string }
> = async (context) => {
  const limitNumber = 5

  const url = `${process.env.API_URL}/recipe-likes/${Number(
    context.params?.userId
  )}/user/number?limit=${limitNumber}`
  const res = await axios.get<IRecipeLike[]>(url)
  return {
    props: { recipeLikes: res.data },
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export default likes
