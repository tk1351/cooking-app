import React, { VFC, useState } from 'react'
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
}

const Search: VFC<Props> = ({ recipes }) => {
  const router = useRouter()
  const { query } = router.query

  const [posts, setPosts] = useState<IRecipe[]>(recipes)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = async () => {
    const limitNumber = 5

    const url = `/recipes/filter?query=${query}&start=${posts.length}&limit=${limitNumber}`
    const res = await API.get<IRecipe[]>(url)

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
        <h1>{query}の検索結果</h1>
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
      <Button onClick={() => router.push('/')}>一覧へ戻る</Button>
    </div>
  )
}

export default Search
