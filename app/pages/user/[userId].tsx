import React, { VFC } from 'react'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import axios from 'axios'
import Navbar from '../../components/common/Navbar'
import { IUser } from '../../re-ducks/auth/type'
import MyPage from '../../components/user/MyPage'
import Footer from '../../components/common/Footer'
import WithUser from '../../src/utils/WithUser'

const userId: VFC<Props> = (props) => {
  return (
    <WithUser>
      <div>
        <Navbar />
        <MyPage user={props} />
        <Footer />
      </div>
    </WithUser>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const url = `https://glacial-waters-79944.herokuapp.com/users`
  const res = await axios.get<IUser[]>(url)
  const users = await res.data

  const paths = users.map((user) => ({
    params: { userId: user.id.toString() },
  }))

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<IUser, { userId: string }> = async (
  context
) => {
  const url = `https://glacial-waters-79944.herokuapp.com/users/${Number(
    context.params?.userId
  )}`
  const res = await axios.get<IUser>(url)
  return {
    props: res.data,
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export default userId
