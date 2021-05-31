import React, { VFC } from 'react'
import Navbar from '../components/common/Navbar'
import Register from '../components/auth/Register'

const register: VFC = () => {
  return (
    <>
      <Navbar />
      <Register />
    </>
  )
}

export default register
