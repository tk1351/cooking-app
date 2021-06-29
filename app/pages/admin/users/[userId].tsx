import React, { VFC } from 'react'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import axios from 'axios'
import { IUser } from '../../../re-ducks/auth/type'
import Navbar from '../../../components/common/Navbar'
import UserInfo from '../../../components/admin/UserInfo'

const userId: VFC<Props> = (props) => {
  return (
    <div>
      <Navbar />
      <UserInfo user={props} />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const url = 'http://api:8080/users'
  const res = await axios.get<IUser[]>(url)
  const users = res.data

  const paths = users.map((user) => ({
    params: { userId: user.id.toString() },
  }))

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<IUser, { userId: string }> = async (
  context
) => {
  const url = `http://api:8080/users/${Number(context.params?.userId)}`
  const res = await axios.get<IUser>(url)
  return {
    props: res.data,
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export default userId
