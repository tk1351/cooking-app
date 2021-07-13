import React, { VFC } from 'react'
import Navbar from '../components/common/Navbar'
import Login from '../components/auth/Login'
import Footer from '../components/common/Footer'
import WithGuest from '../src/utils/WithGuest'

const login: VFC = () => {
  return (
    <WithGuest>
      <div>
        <Navbar />
        <Login />
        <Footer />
      </div>
    </WithGuest>
  )
}

export default login
