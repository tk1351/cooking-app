import React, { VFC } from 'react'
import { InferGetStaticPropsType } from 'next'
import axios from 'axios'
import { IUser } from '../../../re-ducks/auth/type'
import Navbar from '../../../components/common/Navbar'
import UsersList from '../../../components/admin/UsersList'

const list: VFC<Props> = (props) => {
  return (
    <div>
      <Navbar />
      <UsersList {...props} />
    </div>
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
