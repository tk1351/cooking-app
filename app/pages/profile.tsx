import React, { VFC } from 'react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import AuthorProfile from '../components/common/AuthorProfile'

const profile: VFC = () => {
  return (
    <div>
      <Navbar />
      <AuthorProfile />
      <Footer />
    </div>
  )
}

export default profile
