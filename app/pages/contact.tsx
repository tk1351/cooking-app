import React, { VFC } from 'react'
import Navbar from '../components/common/Navbar'
import ContactForm from '../components/form/ContactForm'

const contact: VFC = () => {
  return (
    <div>
      <Navbar />
      <ContactForm />
    </div>
  )
}

export default contact
