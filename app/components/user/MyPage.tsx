import React, { VFC } from 'react'
import Link from 'next/link'
import { Typography, Button, Grid } from '@material-ui/core'
import { IUser } from '../../re-ducks/auth/type'
import styles from '../../styles/components/user/mypage.module.css'

type Props = {
  user: IUser
}

const MyPage: VFC<Props> = ({ user }) => {
  return (
    <Grid container className={styles.wrapper}>
      <Grid item xs={12}>
        <Grid container justify="center">
          <h1 className={styles.h1}>マイページ</h1>
        </Grid>
        <Grid container>
          <Typography gutterBottom variant="h5" component="h2">
            ユーザー名:{user.name}
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
        <Grid container justify="center">
          <Button
            size="small"
            color="primary"
            type="button"
            variant="contained"
          >
            <Link href={`${user.id}/edit`}>プロフィール編集</Link>
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default MyPage
