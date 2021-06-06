import React, { VFC } from 'react'
import { useRouter } from 'next/router'
import { Button } from '@material-ui/core'
import { IRecipe } from '../../re-ducks/recipe/type'
import RecipeItem from './RecipeItem'

type Props = {
  recipes: IRecipe[]
}

const Tag: VFC<Props> = ({ recipes }) => {
  const router = useRouter()
  const { name } = router.query
  return (
    <div>
      <h1>
        #{name} 検索結果：{recipes.length}件
      </h1>
      {recipes.map((recipe) => (
        <RecipeItem key={recipe.id} recipe={recipe} />
      ))}
      <Button onClick={() => router.push('/')}>一覧へ戻る</Button>
    </div>
  )
}

export default Tag
