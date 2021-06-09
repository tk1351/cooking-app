import React, { VFC } from 'react'
import { useRouter } from 'next/router'
import { IUser } from '../../re-ducks/auth/type'
import { Button, Typography } from '@material-ui/core'
import { useAppDispatch } from '../../re-ducks/hooks'
import { deleteUserWithAdminPriviledge } from '../../re-ducks/auth/authSlice'

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
    <div>
      <h1>{user.name}さん</h1>
      <Typography gutterBottom variant="h5" component="h2">
        好きな食べ物:{user.favoriteDish}
      </Typography>
      <Typography gutterBottom variant="h5" component="h2">
        得意料理:{user.specialDish}
      </Typography>
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
      <Button onClick={() => router.push('/admin/users/list')}>
        ユーザーリストへ戻る
      </Button>
    </div>
  )
}

export default UserInfo
