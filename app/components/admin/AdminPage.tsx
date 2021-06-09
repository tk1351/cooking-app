import React, { VFC } from 'react'
import Link from 'next/link'
import { Typography, Button } from '@material-ui/core'
import { IUser } from '../../re-ducks/auth/type'

type Props = {
  user: IUser
}

const AdminPage: VFC<Props> = ({ user }) => {
  return (
    <div>
      <h1>管理者ページ</h1>
      <Typography gutterBottom variant="h5" component="h2">
        管理者名:{user.name}
      </Typography>
      <Typography gutterBottom variant="h5" component="h2">
        好きな食べ物:{user.favoriteDish}
      </Typography>
      <Typography gutterBottom variant="h5" component="h2">
        得意料理:{user.specialDish}
      </Typography>
      <Typography gutterBottom variant="h5" component="h2">
        自己紹介:{user.bio}
      </Typography>
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
      <Button size="small" color="primary" type="button" variant="contained">
        <Link href={`${user.id}/edit`}>プロフィール編集</Link>
      </Button>
      <Button size="small" color="primary" type="button" variant="contained">
        <Link href="users/list">ユーザー一覧へ</Link>
      </Button>
    </div>
  )
}

export default AdminPage
