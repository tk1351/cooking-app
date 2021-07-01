import React, { VFC } from 'react'
import { CircularProgress, Grid } from '@material-ui/core'
import styles from '../../styles/components/common/spinner.module.css'

const Spinner: VFC = () => {
  return (
    <Grid container justify="center" className={styles.spinner}>
      <CircularProgress />
    </Grid>
  )
}

export default Spinner
