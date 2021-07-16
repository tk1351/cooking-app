import React, { VFC } from 'react'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import axios from 'axios'
import { IUser } from '../../re-ducks/auth/type'
import Navbar from '../../components/common/Navbar'
import AdminPage from '../../components/admin/AdminPage'
import Footer from '../../components/common/Footer'
import WithAdmin from '../../src/utils/WithAdmin'

const userId: VFC<Props> = (props) => {
  return (
    <WithAdmin>
      <div>
        <Navbar />
        <AdminPage user={props} />
        <Footer />
      </div>
    </WithAdmin>
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
