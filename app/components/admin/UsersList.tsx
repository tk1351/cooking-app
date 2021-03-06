import React, { VFC, useState } from 'react'
import { useRouter } from 'next/router'
import { Grid, Typography, Button, Container } from '@material-ui/core'
import InfiniteScroll from 'react-infinite-scroller'
import { IUser } from '../../re-ducks/auth/type'
import { useAppSelector } from '../../re-ducks/hooks'
import { selectUserId } from '../../re-ducks/auth/authSlice'
import UserListItem from './UserListItem'
import Spinner from '../common/Spinner'
import styles from '../../styles/components/admin/usersList.module.css'

import API from '../../src/utils/api'

type Props = {
  users: IUser[]
}

const UsersList: VFC<Props> = ({ users }) => {
  const router = useRouter()

  const adminUserId = useAppSelector(selectUserId)

  const [items, setItems] = useState<IUser[]>(users)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = async () => {
    const limitNumber = 10

    const url = `/users/offset?start=${limitNumber}&limit=${limitNumber}`
    const res = await API.get<IUser[]>(url)

    try {
      setItems([...items, ...res.data])
    } finally {
      setHasMore(false)
    }
  }

  const loader = <Spinner key={0} />
  return (
    <Container component="main" maxWidth={false} className={styles.container}>
      <Grid container justify="center" className={styles.h1}>
        <h1>ユーザーリスト</h1>
      </Grid>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} loader={loader}>
        {items.map((item) => (
          <UserListItem key={item.id} user={item} />
        ))}
      </InfiniteScroll>
      <Grid container>
        <Button
          variant="contained"
          color="inherit"
          onClick={() => router.push(`/admin/${Number(adminUserId)}`)}
        >
          戻る
        </Button>
      </Grid>
    </Container>
  )
}

export default UsersList
