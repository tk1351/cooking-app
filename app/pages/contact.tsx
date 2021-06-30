import React, { VFC } from 'react'
import Navbar from '../components/common/Navbar'
import ContactForm from '../components/form/ContactForm'
import Footer from '../components/common/Footer'

const contact: VFC = () => {
  return (
    <div>
      <Navbar />
      <ContactForm />
      <Footer />
    </div>
  )
}

export default contact
