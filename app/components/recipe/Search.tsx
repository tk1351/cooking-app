import React, { VFC, useState } from 'react'
import { useRouter } from 'next/router'
import { Button } from '@material-ui/core'
import axios from 'axios'
import { IRecipe } from '../../re-ducks/recipe/type'
import RecipeItem from './RecipeItem'
import InfiniteScroll from 'react-infinite-scroller'

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

    const url = `/api/recipes/filter?query=${query}&start=${posts.length}&limit=${limitNumber}`
    const res = await axios.get<IRecipe[]>(url)

    try {
      setPosts([...posts, ...res.data])
    } finally {
      setHasMore(false)
    }
  }

  const loader = <div key={0}>Loading ...</div>

  return (
    <div>
      <h1>{query}の検索結果</h1>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} loader={loader}>
        {posts.map((post) => (
          <RecipeItem key={post.id} recipe={post} />
        ))}
      </InfiniteScroll>
      <Button onClick={() => router.push('/')}>一覧へ戻る</Button>
    </div>
  )
}

export default Search
