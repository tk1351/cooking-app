import React, { VFC } from 'react'
import { Grid, Container } from '@material-ui/core'
import { useAuth0 } from '@auth0/auth0-react'
import styles from '../../styles/components/auth/login.module.css'

const Login: VFC = () => {
  const { loginWithRedirect } = useAuth0()

  return (
    <Container component="main" maxWidth={false} className={styles.container}>
      <Grid container justify="center" className={styles.h1}>
        <h1>Googleアカウントでログインする</h1>
      </Grid>
      <Grid container justify="center">
        <button onClick={() => loginWithRedirect()}>
          <img
            src="/static/btn_google_signin_light_pressed_web@2x.png"
            width="300px"
          />
        </button>
      </Grid>
    </Container>
  )
}

export default Login
