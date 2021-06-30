import React, { VFC } from 'react'
import Link from 'next/link'
import { Divider, IconButton } from '@material-ui/core'
import styles from '../../styles/components/common/footer.module.css'

const Footer: VFC = () => {
  return (
    <div className={styles.footer}>
      <Divider />
      <IconButton edge="start" color="inherit" aria-label="open drawer">
        <Link href="/">
          <p>Cooking-app</p>
        </Link>
      </IconButton>
    </div>
  )
}

export default Footer
