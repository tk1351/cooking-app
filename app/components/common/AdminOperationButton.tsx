import React from 'react'
import Link from 'next/link'
import { NextPage } from 'next'
import { Button } from '@material-ui/core'
import { IRecipe } from '../../re-ducks/recipe/type'

type Props = {
  recipe: IRecipe
}

const AdminOperationButton: NextPage<Props> = ({ recipe }) => {
  return (
    <>
      <Button size="small" color="primary" variant="contained" type="button">
        <Link href={`/recipe/edit/${recipe.id}`}>編集</Link>
      </Button>
      <Button size="small" color="secondary" variant="contained" type="button">
        <Link href={`/admin/recipe/${recipe.id}`}>削除</Link>
      </Button>
    </>
  )
}

export default AdminOperationButton
