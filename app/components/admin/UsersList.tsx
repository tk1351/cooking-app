import React, { VFC, useState } from 'react'
import { useRouter } from 'next/router'
import { Grid, Typography, Button } from '@material-ui/core'
import InfiniteScroll from 'react-infinite-scroller'
import { IUser } from '../../re-ducks/auth/type'
import { useAppSelector } from '../../re-ducks/hooks'
import { selectUserId } from '../../re-ducks/auth/authSlice'
import UserListItem from './UserListItem'

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

  const loader = <div key={0}>Loading ...</div>
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">ユーザーリスト</Typography>
          <div>
            <InfiniteScroll
              loadMore={loadMore}
              hasMore={hasMore}
              loader={loader}
            >
              {items.map((item) => (
                <UserListItem key={item.id} user={item} />
              ))}
            </InfiniteScroll>
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
