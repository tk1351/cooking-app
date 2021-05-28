import React from 'react'
import Head from 'next/head'
import { useAppSelector } from '../../re-ducks/hooks'
import {
  selectAuthLoading,
  selectIsAuthenticated,
} from '../../re-ducks/auth/authSlice'

const Home = () => {
  const loading = useAppSelector(selectAuthLoading)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  const guestView = (
    <>
      <h2>ゲストページ</h2>
    </>
  )

  const userView = (
    <>
      <h2>ユーザーページ</h2>
    </>
  )

  return (
    <div>
      <Head>
        <title>Cooking-app</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to Cooking-app!</h1>
        {!loading && <>{isAuthenticated ? userView : guestView}</>}
      </main>
    </div>
  )
}

export default Home
