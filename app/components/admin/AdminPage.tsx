import React, { VFC } from 'react'
import Link from 'next/link'
import { Typography, Button, Grid } from '@material-ui/core'
import { IUser } from '../../re-ducks/auth/type'
import styles from '../../styles/components/admin/adminPage.module.css'

type Props = {
  user: IUser
}

const AdminPage: VFC<Props> = ({ user }) => {
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
        <Grid container>
          <Typography gutterBottom variant="h5" component="h2">
            好きな食べ物:{user.favoriteDish}
          </Typography>
        </Grid>
        <Grid container>
          <Typography gutterBottom variant="h5" component="h2">
            得意料理:{user.specialDish}
          </Typography>
        </Grid>
        <Grid container>
          <Typography gutterBottom variant="h5" component="h2">
            自己紹介:{user.bio}
          </Typography>
        </Grid>
        {user.socials.map((social) => (
          <Typography
            key={social.id}
            gutterBottom
            variant="h5"
            component="h2"
            color="primary"
          >
            <a href={social.url} target="_blank" rel="noopener noreferrer">
              {social.url}
            </a>
          </Typography>
        ))}
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
