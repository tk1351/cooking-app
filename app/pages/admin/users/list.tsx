import React, { VFC } from 'react'
import { InferGetStaticPropsType } from 'next'
import axios from 'axios'
import { IUser } from '../../../re-ducks/auth/type'
import Navbar from '../../../components/common/Navbar'
import UsersList from '../../../components/admin/UsersList'
import Footer from '../../../components/common/Footer'
import WithAdmin from '../../../src/utils/WithAdmin'

const list: VFC<Props> = (props) => {
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
  const url = `http://api:8080/users/number?limit=${limitNumber}`
  const res = await axios.get<IUser[]>(url)
  return {
    props: { users: res.data },
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export default list
