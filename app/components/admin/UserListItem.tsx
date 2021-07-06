import React, { VFC } from 'react'
import Link from 'next/link'
import {
  ListItem,
  ListItemText,
  Button,
  List,
  Divider,
  Grid,
} from '@material-ui/core'
import { IUser } from '../../re-ducks/auth/type'
import styles from '../../styles/components/admin/usersListItem.module.css'

type Props = {
  user: IUser
}

const UserListItem: VFC<Props> = ({ user }) => {
  return (
    <List key={user.id}>
      <ListItem key={user.id}>
        <ListItemText key={user.id} primary={user.name} />
        <div>
          <Button key={user.id} color="primary" variant="contained">
            <Link key={user.id} href={`/admin/users/${user.id}`}>
              ユーザーの詳細
            </Link>
          </Button>
        </div>
      </ListItem>
      <Grid container>
        <Grid item className={styles.divider}>
          <Divider />
        </Grid>
      </Grid>
    </List>
  )
}

export default UserListItem
