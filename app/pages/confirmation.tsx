import React, { VFC } from 'react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import Confirmation from '../components/recipe/Confirmation'

const confirmation: VFC = () => {
  return (
    <div>
      <Navbar />
      <Confirmation />
      <Footer />
    </div>
  )
}

export default confirmation
