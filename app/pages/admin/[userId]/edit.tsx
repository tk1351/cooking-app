import React from 'react'
import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import axios from 'axios'
import { IUser } from '../../../re-ducks/auth/type'
import Navbar from '../../../components/common/Navbar'
import EditProfileForm from '../../../components/admin/EditProfileForm'
import Footer from '../../../components/common/Footer'
import WithAdmin from '../../../src/utils/WithAdmin'

const edit: NextPage<Props> = (props) => {
  return (
    <WithAdmin>
      <div>
        <Navbar />
        <EditProfileForm user={props} />
        <Footer />
      </div>
    </WithAdmin>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const url = `${process.env.API_URL}/users`
  const res = await axios.get<[IUser[], number]>(url)
  const users = res.data[0]

  const paths = users.map((user) => ({
    params: { userId: user.id.toString() },
  }))

  return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps<IUser, { userId: string }> = async (
  context
) => {
  const url = `${process.env.API_URL}/users/${Number(context.params?.userId)}`
  const res = await axios.get<IUser>(url)
  return {
    props: res.data,
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export default edit
