import React, { VFC } from 'react'

const ContactForm: VFC = () => {
  const formStyles = {
    width: '100%',
    height: '600px',
    overflow: 'auto',
    overflowScrolling: 'touch',
  }
  return (
    <div>
      <div style={formStyles}>
        <iframe
          src="https://tayori.com/form/46b7639436ad896573995887f298bc7ceba81142"
          width="100%"
          height="100%"
        ></iframe>
      </div>
    </div>
  )
}

export default ContactForm
