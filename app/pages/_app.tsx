import React, { useEffect } from 'react'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {
  ThemeProvider as MaterialUIThemeProvider,
  StylesProvider,
} from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { Provider } from 'react-redux'
import { store } from '../re-ducks/store'
import theme from '../src/theme'

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }, [])
  return (
    <Provider store={store}>
      <StylesProvider injectFirst>
        <MaterialUIThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </MaterialUIThemeProvider>
      </StylesProvider>
    </Provider>
  )
}
export default MyApp
