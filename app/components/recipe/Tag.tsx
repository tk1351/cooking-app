import React, { VFC, useState } from 'react'
import { useRouter } from 'next/router'
import { Button } from '@material-ui/core'
import InfiniteScroll from 'react-infinite-scroller'
import axios from 'axios'
import { IRecipe } from '../../re-ducks/recipe/type'
import RecipeItem from './RecipeItem'

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

    const url = `/api/recipes/tag?name=${name}&start=${posts.length}&limit=${limitNumber}`
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
      <h1>#{name} の検索結果</h1>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} loader={loader}>
        {posts.map((post) => (
          <RecipeItem key={post.id} recipe={post} />
        ))}
      </InfiniteScroll>
      <Button onClick={() => router.push('/')}>一覧へ戻る</Button>
    </div>
  )
}

export default Tag
