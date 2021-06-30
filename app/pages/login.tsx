import React, { VFC } from 'react'
import Navbar from '../components/common/Navbar'
import Login from '../components/auth/Login'
import Footer from '../components/common/Footer'

const login: VFC = () => {
  return (
    <>
      <Navbar />
      <Login />
      <Footer />
    </>
  )
}

export default login
