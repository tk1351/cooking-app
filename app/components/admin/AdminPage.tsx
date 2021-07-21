import React, { VFC } from 'react'
import Link from 'next/link'
import { Typography, Button, Grid, Avatar } from '@material-ui/core'
import { IUser } from '../../re-ducks/auth/type'
import styles from '../../styles/components/admin/adminPage.module.css'
import SocialLinks from '../common/SocialLinks'

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
        <Grid container justify="center" className={styles.avatar}>
          <Avatar
            src={user.picture}
            style={{ height: '5rem', width: '5rem' }}
          />
        </Grid>
        <SocialLinks socials={user.socials} />
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
