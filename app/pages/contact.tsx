import React, { VFC } from 'react'
import Navbar from '../components/common/Navbar'
import ContactForm from '../components/form/ContactForm'
import Footer from '../components/common/Footer'
import WithUser from '../src/utils/WithUser'

const contact: VFC = () => {
  return (
    <WithUser>
      <div>
        <Navbar />
        <ContactForm />
        <Footer />
      </div>
    </WithUser>
  )
}

export default contact
