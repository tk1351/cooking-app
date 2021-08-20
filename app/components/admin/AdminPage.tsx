import React from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import { Typography, Button, Grid } from '@material-ui/core'
import { IUser } from '../../re-ducks/auth/type'
import Profile from '../common/Profile'
import styles from '../../styles/components/admin/adminPage.module.css'

type Props = {
  user: IUser
}

const AdminPage: NextPage<Props> = ({ user }) => {
  return (
    <Grid container className={styles.wrapper}>
      <Grid item xs={12}>
        <Grid container justify="center">
          <h1 className={styles.h1}>管理者ページ</h1>
        </Grid>
        <Grid container>
          <Typography gutterBottom variant="h5" component="h2">
            管理者名:{user.name}
          </Typography>
        </Grid>
        <Profile user={user} />
        <Grid container className={styles.buttonWrapper}>
          <Button
            size="small"
            color="primary"
            type="button"
            variant="contained"
          >
            <Link href={`/admin/${user.id}/edit`}>プロフィール編集</Link>
          </Button>
          <Button
            size="small"
            color="primary"
            type="button"
            variant="contained"
          >
            <Link href="/admin/users/list">ユーザー一覧へ</Link>
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default AdminPage
