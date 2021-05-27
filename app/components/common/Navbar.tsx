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

const Navbar = () => {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="open drawer">
            <Link href="/">Cooking-app</Link>
          </IconButton>
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
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Navbar
