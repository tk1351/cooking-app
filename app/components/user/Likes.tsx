import React, { VFC } from 'react'
import { useRouter } from 'next/router'
import { Button } from '@material-ui/core'
import { IUser } from '../../re-ducks/auth/type'
import RecipeItem from '../recipe/RecipeItem'

type Props = {
  user: IUser
}

const Likes: VFC<Props> = ({ user }) => {
  const router = useRouter()

  const { recipeLikes } = user
  return (
    <div>
      <h1>お気に入りレシピ一覧 {recipeLikes.length}件</h1>
      {recipeLikes.map((recipeLike) => (
        <RecipeItem key={recipeLike.id} recipe={recipeLike.recipe} />
      ))}
      <Button onClick={() => router.push('/')}>一覧へ戻る</Button>
    </div>
  )
}

export default Likes
