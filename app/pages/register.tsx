import React, { VFC } from 'react'
import Navbar from '../components/common/Navbar'
import Register from '../components/auth/Register'
import Footer from '../components/common/Footer'

const register: VFC = () => {
  return (
    <>
      <Navbar />
      <Register />
      <Footer />
    </>
  )
}

export default register
