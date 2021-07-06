import React, { VFC, useState } from 'react'
import { useRouter } from 'next/router'
import { Button, Grid } from '@material-ui/core'
import InfiniteScroll from 'react-infinite-scroller'
import RecipeItem from '../recipe/RecipeItem'
import { IRecipeLike } from '../../re-ducks/defaultType'
import Spinner from '../common/Spinner'
import styles from '../../styles/components/user/likes.module.css'

import API from '../../src/utils/api'

type Props = {
  recipeLikes: IRecipeLike[]
}

const Likes: VFC<Props> = ({ recipeLikes }) => {
  const router = useRouter()
  const userId = router.query.userId

  const [posts, setPosts] = useState<IRecipeLike[]>(recipeLikes)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = async () => {
    const limitNumber = 5

    const url = `/recipe-likes/${Number(userId)}/user/offset?start=${
      posts.length
    }&limit=${limitNumber}`
    const res = await API.get<IRecipeLike[]>(url)

    try {
      setPosts([...posts, ...res.data])
    } finally {
      setHasMore(false)
    }
  }

  const loader = <Spinner key={0} />

  return (
    <div>
      <Grid container justify="center" className={styles.h1}>
        <h1>お気に入りレシピ一覧</h1>
      </Grid>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} loader={loader}>
        <Grid container spacing={2}>
          <Grid item xs={2} />
          <Grid item xs={8}>
            <Grid container spacing={5}>
              {posts.map((post) => (
                <RecipeItem key={post.id} recipe={post.recipe} />
              ))}
            </Grid>
          </Grid>
          <Grid item xs={2} />
        </Grid>
      </InfiniteScroll>
      <Grid container justify="flex-start">
        <Button
          variant="contained"
          color="inherit"
          onClick={() => router.push('/')}
          className={styles.back}
        >
          一覧へ戻る
        </Button>
      </Grid>
    </div>
  )
}

export default Likes
