import React, { VFC } from 'react'
import { InferGetStaticPropsType } from 'next'
import axios from 'axios'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { IUser } from '../re-ducks/auth/type'
import AuthorProfile from '../components/common/AuthorProfile'

const profile: VFC<Props> = (props) => {
  console.log('data', props)
  return (
    <div>
      <Navbar />
      <AuthorProfile user={props} />
      <Footer />
    </div>
  )
}

export const getStaticProps = async () => {
  const id = 1
  const url = `${process.env.API_URL}/users/author/${id}`
  const res = await axios.get<IUser>(url)
  return {
    props: res.data,
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export default profile
