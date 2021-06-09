import React, { VFC } from 'react'
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

type Props = {
  users: IUser[]
}

const UsersList: VFC<Props> = ({ users }) => {
  const router = useRouter()
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">ユーザーリスト</Typography>
          <div>
            <List>
              <ListItem>
                {users.map((user) => (
                  <ListItemText
                    key={user.id}
                    primary={user.name}
                    secondary={user.favoriteDish + '/' + user.specialDish}
                  />
                ))}
              </ListItem>
            </List>
          </div>
        </Grid>
      </Grid>
      <Button onClick={() => router.back()}>戻る</Button>
    </>
  )
}

export default UsersList
