import React, { useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Button, Grid } from '@material-ui/core'
import InfiniteScroll from 'react-infinite-scroller'
import { IRecipe } from '../../re-ducks/recipe/type'
import RecipeItem from './RecipeItem'
import Spinner from '../common/Spinner'
import styles from '../../styles/components/recipe/search.module.css'

import API from '../../src/utils/api'

type Props = {
  recipes: IRecipe[]
  count: number
}

const Search: NextPage<Props> = ({ recipes, count }) => {
  const router = useRouter()
  const { query } = router.query

  const [posts, setPosts] = useState<IRecipe[]>(recipes)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = async () => {
    const limitNumber = 5

    const url = `/recipes?query=${query}&start=${posts.length}&limit=${limitNumber}`
    const res = await API.get<[IRecipe[], number]>(url)

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
          {query}の検索結果: {count}件
        </h1>
      </Grid>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} loader={loader}>
        <Grid container spacing={2}>
          <Grid item xs={2} />
          <Grid item xs={8}>
            <Grid container spacing={5}>
              {posts.map((post) => (
                <RecipeItem key={post.id} recipe={post} />
              ))}
            </Grid>
          </Grid>
          <Grid item xs={2} />
        </Grid>
      </InfiniteScroll>
      <Grid container spacing={2} className={styles.buttonWrapper}>
        <Grid item xs={2} />
        <Grid item xs={8}>
          <Button
            variant="contained"
            color="inherit"
            onClick={() => router.push('/')}
            className={styles.back}
          >
            一覧へ戻る
          </Button>
        </Grid>
        <Grid item xs={2} />
      </Grid>
    </div>
  )
}

export default Search
