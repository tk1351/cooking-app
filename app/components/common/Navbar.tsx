import React, { VFC } from 'react'
import Link from 'next/link'
import { AppBar, Toolbar, IconButton, Button } from '@material-ui/core'
import { useAuth0 } from '@auth0/auth0-react'
import { useAppSelector } from '../../re-ducks/hooks'
import { selectUserRole, selectUserId } from '../../re-ducks/auth/authSlice'
import SearchForm from '../form/SearchForm'
import styles from '../../styles/components/common/navbar.module.css'

const Navbar: VFC = () => {
  const { isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0()
  const userRole = useAppSelector(selectUserRole)
  const userId = useAppSelector(selectUserId)

  const guestLinks = (
    <div className={styles.links}>
      <SearchForm />
      <div className={styles.link}>
        <Button color="inherit" onClick={() => loginWithRedirect()}>
          ユーザー登録
        </Button>
      </div>
      <div className={styles.link}>
        <Button color="inherit" onClick={() => loginWithRedirect()}>
          ログイン
        </Button>
      </div>
    </div>
  )

  const userLinks = (
    <div className={styles.links}>
      <SearchForm />
      <Button color="inherit">
        <Link href={`/user/${userId}`}>マイページ</Link>
      </Button>
      <Button color="inherit">
        <Link href={`/user/${userId}/likes`}>お気に入り</Link>
      </Button>
      <Button color="inherit" onClick={() => logout()}>
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
      <Button color="inherit" onClick={() => logout()}>
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
          {!isLoading && (
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
