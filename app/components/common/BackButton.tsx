import React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Button } from '@material-ui/core'
import styles from '../../styles/components/common/backButton.module.css'

type Props = {
  text: string
}

const BackButton: NextPage<Props> = ({ text }) => {
  const router = useRouter()
  return (
    <Button
      variant="contained"
      color="inherit"
      onClick={() => router.push('/')}
      className={styles.back}
    >
      {text}
    </Button>
  )
}

export default BackButton
