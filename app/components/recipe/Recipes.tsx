import React, { VFC, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { Grid } from '@material-ui/core'
import RecipeItem from './RecipeItem'
import { IRecipe } from '../../re-ducks/recipe/type'
import Spinner from '../common/Spinner'
import styles from '../../styles/components/recipe/recipes.module.css'

import API from '../../src/utils/api'

type Props = {
  recipes: IRecipe[]
}

const Recipes: VFC<Props> = ({ recipes }) => {
  const [posts, setPosts] = useState<IRecipe[]>(recipes)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = async () => {
    const limitNumber = 5

    const url = `/recipes/offset?start=${posts.length}&limit=${limitNumber}`
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
        <h1>レシピ一覧</h1>
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
    </div>
  )
}

export default Recipes
