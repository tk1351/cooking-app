import React, { useEffect } from 'react'
import '../styles/globals.css'
import '../styles/reset.css'
import type { AppProps } from 'next/app'
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components'
import { ThemeProvider as MaterialUIThemeProvider } from '@material-ui/core/styles'
import { StylesProvider } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { unwrapResult } from '@reduxjs/toolkit'
import { Provider as ReduxProvider } from 'react-redux'
import { Auth0Provider } from '@auth0/auth0-react'
import { store } from '../re-ducks/store'
import theme from '../src/theme'
import { useAppDispatch } from '../re-ducks/hooks'
import { fetchCurrentUser } from '../re-ducks/auth/authSlice'

const AppInit = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const isAuthenticated = async () => {
      const resultAction = await dispatch(fetchCurrentUser())
      if (fetchCurrentUser.fulfilled.match(resultAction)) {
        unwrapResult(resultAction)
      }
    }
    isAuthenticated()
  }, [])
  return null
}

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles)
    }
  }, [])
  return (
    <Auth0Provider
      domain={'dev-business-app.us.auth0.com'}
      clientId={'4aUgo5jVh2BPNCMD4JvcsT4ngSLYRBAT'}
      redirectUri={'http://localhost:3000'}
      audience={'http://localhost:8080'}
    >
      <ReduxProvider store={store}>
        <StylesProvider injectFirst>
          <MaterialUIThemeProvider theme={theme}>
            <StyledComponentsThemeProvider theme={theme}>
              <CssBaseline />
              <Component {...pageProps} />
              <AppInit />
            </StyledComponentsThemeProvider>
          </MaterialUIThemeProvider>
        </StylesProvider>
      </ReduxProvider>
    </Auth0Provider>
  )
}
export default MyApp
