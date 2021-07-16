import React, { VFC, useEffect } from 'react'
import Head from 'next/head'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { useAppSelector } from '../../re-ducks/hooks'
import { selectUserRole } from '../../re-ducks/auth/authSlice'
import Recipes from '../recipe/Recipes'
import { IRecipe } from '../../re-ducks/recipe/type'
import Alert from './Alert'

type Props = {
  recipes: IRecipe[]
}

const Home: VFC<Props> = (props) => {
  const userRole = useAppSelector(selectUserRole)
  const {
    loginWithRedirect,
    user,
    logout,
    isAuthenticated,
    isLoading,
  } = useAuth0()

  console.log('role', userRole)

  console.log('isAuthenticated', isAuthenticated)

  useEffect(() => {
    ;(async () => {
      if (user) {
        const { name, email, sub } = user
        const url =
          process.env.NODE_ENV === 'production'
            ? process.env.API_URL
            : 'http://localhost:8080'

        await axios.post(`${url}/users/register`, {
          name,
          email,
          sub,
        })
        console.log('ok')
      }
    })()
  }, [user])

  const register = async () => {
    if (user) {
      const { name, email, sub } = user
      await axios.post('http://localhost:8080/users/register', {
        name,
        email,
        sub,
      })
      console.log('ok')
    }
  }

  console.log('user', user)

  const guestView = (
    <>
      <h2>ゲストページ</h2>
      <button onClick={() => loginWithRedirect()}>ログイン</button>
    </>
  )

  const userView = (
    <>
      <h2>ユーザーページ</h2>
      <button onClick={() => logout({ returnTo: 'http://localhost:3000' })}>
        ログアウト
      </button>
    </>
  )

  console.log('role')

  const adminView = (
    <>
      <h2>管理者ページ</h2>
      <button onClick={() => logout({ returnTo: 'http://localhost:3000' })}>
        ログアウト
      </button>
    </>
  )

  const Views = () => {
    if (isAuthenticated && userRole === 'user') {
      return userView
    } else if (isAuthenticated && userRole === 'admin') {
      return adminView
    } else {
      return guestView
    }
  }

  return (
    <div>
      <Head>
        <title>Cooking-app</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Alert />
        {!isLoading && (
          <>
            <Views />
            <Recipes {...props} />
          </>
        )}
      </main>
    </div>
  )
}

export default Home
