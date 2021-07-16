import React, { VFC } from 'react'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import axios from 'axios'
import { IUser } from '../../../re-ducks/auth/type'
import Navbar from '../../../components/common/Navbar'
import EditProfileForm from '../../../components/user/EditProfileForm'
import Footer from '../../../components/common/Footer'
import WithUser from '../../../src/utils/WithUser'

const edit: VFC<Props> = (props) => {
  return (
    <WithUser>
      <div>
        <Navbar />
        <EditProfileForm user={props} />
        <Footer />
      </div>
    </WithUser>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const url = `https://glacial-waters-79944.herokuapp.com/users`
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
  const url = `https://glacial-waters-79944.herokuapp.com/users/${Number(
    context.params?.userId
  )}`
  const res = await axios.get<IUser>(url)
  return {
    props: res.data,
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export default edit
