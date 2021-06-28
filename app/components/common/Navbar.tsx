import React, { VFC } from 'react'
import Link from 'next/link'
import { AppBar, Toolbar, IconButton, Button } from '@material-ui/core'
import { unwrapResult } from '@reduxjs/toolkit'
import { useAppDispatch, useAppSelector } from '../../re-ducks/hooks'
import {
  selectAuthLoading,
  selectIsAuthenticated,
  logout,
  fetchCurrentUser,
  selectUserRole,
  selectUserId,
} from '../../re-ducks/auth/authSlice'
import SearchForm from '../form/SearchForm'
import styles from '../../styles/components/common/navbar.module.css'

const Navbar: VFC = () => {
  const dispatch = useAppDispatch()

  const loading = useAppSelector(selectAuthLoading)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const userRole = useAppSelector(selectUserRole)
  const userId = useAppSelector(selectUserId)

  const clearAuthState = async () => {
    await dispatch(logout())
    const resultAction = await dispatch(fetchCurrentUser())
    if (fetchCurrentUser.fulfilled.match(resultAction)) {
      unwrapResult(resultAction)
    }
  }

  const guestLinks = (
    <div className={styles.links}>
      <SearchForm />
      <div className={styles.link}>
        <Link href="/register">
          <p>ユーザー登録</p>
        </Link>
      </div>
      <div className={styles.link}>
        <Link href="/login">
          <p>ログイン</p>
        </Link>
      </div>
    </div>
  )

  const userLinks = (
    <div className={styles.links}>
      <SearchForm />
      <Button color="inherit">
        <Link href={`user/${userId}`}>マイページ</Link>
      </Button>
      <Button color="inherit">
        <Link href={`/user/${userId}/likes`}>お気に入り</Link>
      </Button>
      <Button color="inherit" onClick={() => clearAuthState()}>
        ログアウト
      </Button>
    </div>
  )

  const adminLinks = (
    <div className={styles.links}>
      <SearchForm />
      <Button color="inherit">
        <Link href={`/admin/${userId}`}>管理者ページ</Link>
      </Button>
      <Button color="inherit">
        <Link href="/admin/recipeform">レシピ投稿</Link>
      </Button>
      <Button color="inherit" onClick={() => clearAuthState()}>
        ログアウト
      </Button>
    </div>
  )

  const Links = () => {
    if (isAuthenticated && userRole === 'user') {
      return userLinks
    } else if (isAuthenticated && userRole === 'admin') {
      return adminLinks
    } else {
      return guestLinks
    }
  }

  return (
    <div>
      <AppBar position="static" className={styles.appBar}>
        <Toolbar className={styles.toolbar}>
          <IconButton edge="start" color="inherit" aria-label="open drawer">
            <Link href="/">
              <p>Cooking-app</p>
            </Link>
          </IconButton>
          {!loading && (
            <div>
              <Links />
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Navbar
