import React, { useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Grid } from '@material-ui/core'
import InfiniteScroll from 'react-infinite-scroller'
import RecipeItem from '../recipe/RecipeItem'
import { IRecipeLike } from '../../re-ducks/defaultType'
import Spinner from '../common/Spinner'
import { useAppSelector } from '../../re-ducks/hooks'
import { selectUserName } from '../../re-ducks/auth/authSlice'
import BackButton from '../common/BackButton'
import styles from '../../styles/components/user/likes.module.css'

import API from '../../src/utils/api'

type Props = {
  recipeLikes: IRecipeLike[]
  count: number
}

const Likes: NextPage<Props> = ({ recipeLikes, count }) => {
  const router = useRouter()
  const userId = router.query.userId

  const userName = useAppSelector(selectUserName)

  const [posts, setPosts] = useState<IRecipeLike[]>(recipeLikes)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = async () => {
    const limitNumber = 5

    const url = `/recipe-likes/${Number(userId)}/user?start=${
      posts.length
    }&limit=${limitNumber}`
    const res = await API.get<[IRecipeLike[], number]>(url)

    const data = res.data[0]
    setPosts([...posts, ...data])

    if (data.length < 1) {
      setHasMore(false)
    }
  }

  const loader = <Spinner key={0} />

  return (
    <div>
      <Grid container justify="center" className={styles.h1}>
        <h1>
          {userName}さんのお気に入りレシピ: {count}件
        </h1>
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
        <BackButton text={'一覧へ戻る'} />
      </Grid>
    </div>
  )
}

export default Likes
