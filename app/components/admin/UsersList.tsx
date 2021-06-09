import React, { VFC } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@material-ui/core'
import { IUser } from '../../re-ducks/auth/type'
import { useAppSelector } from '../../re-ducks/hooks'
import { selectUserId } from '../../re-ducks/auth/authSlice'

type Props = {
  users: IUser[]
}

const UsersList: VFC<Props> = ({ users }) => {
  const router = useRouter()

  const adminUserId = useAppSelector(selectUserId)
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">ユーザーリスト</Typography>
          <div>
            <List>
              <ListItem>
                {users.map((user) => (
                  <>
                    <ListItemText key={user.id} primary={user.name} />
                    <div>
                      <Button key={user.id} color="primary" variant="contained">
                        <Link key={user.id} href={`/admin/users/${user.id}`}>
                          ユーザーの詳細
                        </Link>
                      </Button>
                    </div>
                  </>
                ))}
              </ListItem>
            </List>
          </div>
        </Grid>
      </Grid>
      <Button onClick={() => router.push(`/admin/${Number(adminUserId)}`)}>
        戻る
      </Button>
    </>
  )
}

export default UsersList
