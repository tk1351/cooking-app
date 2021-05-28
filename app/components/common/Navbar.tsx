import React from 'react'
import Link from 'next/link'
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Button,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import { unwrapResult } from '@reduxjs/toolkit'
import { useAppDispatch, useAppSelector } from '../../re-ducks/hooks'
import {
  selectAuthLoading,
  selectIsAuthenticated,
  logout,
  fetchCurrentUser,
} from '../../re-ducks/auth/authSlice'

const Navbar = () => {
  const dispatch = useAppDispatch()

  const loading = useAppSelector(selectAuthLoading)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  const clearAuthState = async () => {
    await dispatch(logout())
    const resultAction = await dispatch(fetchCurrentUser())
    if (fetchCurrentUser.fulfilled.match(resultAction)) {
      unwrapResult(resultAction)
    }
  }

  const guestLinks = (
    <>
      <div>
        <div>
          <SearchIcon />
          <InputBase placeholder="レシピを検索する" />
          <Button color="inherit">検索</Button>
        </div>
      </div>
      <div>
        <Button color="inherit">
          <Link href="/register">ユーザー登録</Link>
        </Button>
        <Button color="inherit">
          <Link href="/login">ログイン</Link>
        </Button>
      </div>
    </>
  )

  const userLinks = (
    <>
      <div>
        <div>
          <SearchIcon />
          <InputBase placeholder="レシピを検索する" />
          <Button color="inherit">検索</Button>
        </div>
      </div>
      <div>
        <Button color="inherit">
          <Link href="/mypage">マイページ</Link>
        </Button>
        <Button color="inherit">
          <Link href="/favorites">お気に入り</Link>
        </Button>
        <Button color="inherit" onClick={() => clearAuthState()}>
          ログアウト
        </Button>
      </div>
    </>
  )

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="open drawer">
            <Link href="/">Cooking-app</Link>
          </IconButton>
          {!loading && <>{isAuthenticated ? userLinks : guestLinks}</>}
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Navbar
