/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '../../test-utils'
import RecipeItem from '../../../components/recipe/RecipeItem'
import { IUser, IAuthState } from '../../../re-ducks/auth/type'
import { IRecipe } from '../../../re-ducks/recipe/type'

const dummyUser: IUser = {
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'dummy name',
  email: 'dummy@example.com',
  role: 'admin',
  sub: 'dummy sub',
  picture: 'dummy picture',
  favoriteDish: 'dummy',
  specialDish: 'dummy',
  bio: 'dummy',
  recipes: [],
  recipeLikes: [],
  socials: [],
}

const mockRecipe: IRecipe = {
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'dummy name',
  time: 5,
  url: 'https://',
  remarks: 'dummy remarks',
  image: 'dummy image',
  ingredients: [],
  recipeDescriptions: [],
  recipeLikes: [],
  tags: [],
  user: dummyUser,
}

type OmitUser = Omit<IAuthState, 'status' | 'message' | 'error'>
const admin: OmitUser = {
  auth: {
    token: 'dummy token',
    loading: false,
    user: { id: 1, name: 'dummy name', role: 'admin' },
    isAuthenticated: true,
  },
}

describe('レンダリング', () => {
  it('propsとして渡されるrecipeが正しく表示される', () => {
    render(<RecipeItem recipe={mockRecipe} />)
    expect(screen.getByText('dummy name')).toBeInTheDocument()
    expect(screen.getByText('詳細')).toBeInTheDocument()
  })

  it('roleがadminの場合は編集と削除のボタンが表示される', () => {
    render(<RecipeItem recipe={mockRecipe} />, {
      initialState: { auth: admin },
    })
    expect(screen.getByText('編集')).toBeInTheDocument()
    expect(screen.getByText('削除')).toBeInTheDocument()
  })
})
