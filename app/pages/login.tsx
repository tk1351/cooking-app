import React, { VFC } from 'react'
import Navbar from '../components/common/Navbar'
import Login from '../components/auth/Login'

const login: VFC = () => {
  return (
    <>
      <Navbar />
      <Login />
    </>
  )
}

export default login
