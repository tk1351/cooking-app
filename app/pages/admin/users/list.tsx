import React from 'react'
import { InferGetStaticPropsType, NextPage } from 'next'
import axios from 'axios'
import { IUser } from '../../../re-ducks/auth/type'
import Navbar from '../../../components/common/Navbar'
import UsersList from '../../../components/admin/UsersList'
import Footer from '../../../components/common/Footer'
import WithAdmin from '../../../src/utils/WithAdmin'

const list: NextPage<Props> = (props) => {
  return (
    <WithAdmin>
      <div>
        <Navbar />
        <UsersList {...props} />
        <Footer />
      </div>
    </WithAdmin>
  )
}

export const getStaticProps = async () => {
  const limitNumber = 10
  const start = 0

  const url = `${process.env.API_URL}/users?start=${start}&limit=${limitNumber}`
  const res = await axios.get<[IUser[], number]>(url)
  const users = res.data[0]
  const count = res.data[1]

  return {
    props: { users, count },
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export default list
