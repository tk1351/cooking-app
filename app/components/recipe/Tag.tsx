import React, { VFC, useState } from 'react'
import { useRouter } from 'next/router'
import { Button, Grid } from '@material-ui/core'
import InfiniteScroll from 'react-infinite-scroller'
import { IRecipe } from '../../re-ducks/recipe/type'
import RecipeItem from './RecipeItem'
import Spinner from '../common/Spinner'
import styles from '../../styles/components/recipe/tag.module.css'

import API from '../../src/utils/api'

type Props = {
  recipes: IRecipe[]
}

const Tag: VFC<Props> = ({ recipes }) => {
  const router = useRouter()
  const { name } = router.query

  const [posts, setPosts] = useState<IRecipe[]>(recipes)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = async () => {
    const limitNumber = 5

    const url = `/recipes/tag?name=${name}&start=${posts.length}&limit=${limitNumber}`
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
        <h1>#{name} の検索結果</h1>
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

export default Tag
