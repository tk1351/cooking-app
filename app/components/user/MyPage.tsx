import React, { VFC } from 'react'
import Link from 'next/link'
import { Typography, Button } from '@material-ui/core'
import { IUser } from '../../re-ducks/auth/type'
import Alert from '../common/Alert'

type Props = {
  user: IUser
}

const MyPage: VFC<Props> = ({ user }) => {
  return (
    <div>
      <Alert />
      <h1>マイページ</h1>
      <Typography gutterBottom variant="h5" component="h2">
        ユーザー名:{user.name}
      </Typography>
      <Typography gutterBottom variant="h5" component="h2">
        好きな食べ物:{user.favoriteDish}
      </Typography>
      <Typography gutterBottom variant="h5" component="h2">
        得意料理:{user.specialDish}
      </Typography>
      <Button size="small" color="primary" type="button" variant="contained">
        <Link href={`${user.id}/edit`}>プロフィール編集</Link>
      </Button>
    </div>
  )
}

export default MyPage
