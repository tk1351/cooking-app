import React, { VFC, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import RecipeItem from './RecipeItem'
import { IRecipe } from '../../re-ducks/recipe/type'

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

  const loader = <div key={0}>Loading ...</div>

  return (
    <div>
      <h1>レシピ一覧</h1>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} loader={loader}>
        {posts.map((post) => (
          <RecipeItem key={post.id} recipe={post} />
        ))}
      </InfiniteScroll>
    </div>
  )
}

export default Recipes
