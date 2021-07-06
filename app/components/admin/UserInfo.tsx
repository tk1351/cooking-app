import React, { VFC } from 'react'
import { useRouter } from 'next/router'
import { IUser } from '../../re-ducks/auth/type'
import { Button, Typography, Grid } from '@material-ui/core'
import { useAppDispatch } from '../../re-ducks/hooks'
import { deleteUserWithAdminPriviledge } from '../../re-ducks/auth/authSlice'
import styles from '../../styles/components/admin/userInfo.module.css'

type Props = {
  user: IUser
}

const UserInfo: VFC<Props> = ({ user }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const onDeleteUserClicked = async () => {
    if (
      window.confirm(`ID: ${user.id}のユーザーを削除してもよろしいですか？`)
    ) {
      await dispatch(deleteUserWithAdminPriviledge(user.id))
      await router.back()
    }
  }

  return (
    <Grid container className={styles.wrapper}>
      <Grid item xs={12}>
        <Grid container justify="center">
          <h1 className={styles.h1}>{user.name}さん</h1>
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
        <Grid container className={styles.buttonWrapper}>
          <Button
            variant="contained"
            color="inherit"
            onClick={() => router.push('/admin/users/list')}
          >
            ユーザーリストへ戻る
          </Button>
          {user.role === 'user' ? (
            <Button
              color="secondary"
              variant="contained"
              onClick={onDeleteUserClicked}
            >
              ユーザーを削除する
            </Button>
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default UserInfo
