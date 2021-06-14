/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '../../test-utils'
import Home from '../../../components/common/Home'
import { IRecipe } from '../../../re-ducks/recipe/type'
import { IUser, IAuthState } from '../../../re-ducks/auth/type'

const dummyUser: IUser = {
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'dummy name',
  email: 'dummy@example.com',
  role: 'admin',
  favoriteDish: 'dummy',
  specialDish: 'dummy',
  bio: 'dummy',
  recipes: [],
  recipeLikes: [],
  socials: [],
}

const dummyRecipes: IRecipe[] = [
  {
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'dummy name',
    time: 5,
    remarks: 'dummy remarks',
    image: 'dummy image',
    ingredients: [],
    recipeDescriptions: [],
    recipeLikes: [],
    tags: [],
    user: dummyUser,
  },
]

type OmitUser = Omit<IAuthState, 'status' | 'message' | 'error'>

const admin: OmitUser = {
  auth: {
    token: 'dummy token',
    loading: false,
    user: { id: 1, name: 'dummy name', role: 'admin' },
    isAuthenticated: true,
  },
}

const user: OmitUser = {
  auth: {
    token: 'dummy token',
    loading: false,
    user: { id: 1, name: 'dummy name', role: 'user' },
    isAuthenticated: true,
  },
}

describe('レンダリング', () => {
  it('loading中はレシピ一覧が表示されない', () => {
    render(<Home recipes={dummyRecipes} />)
    expect(screen.queryByText(/レシピ一覧/)).not.toBeInTheDocument()
  })

  it('認証が無い場合はゲストページがレンダリングされる', () => {
    render(<Home recipes={dummyRecipes} />, {
      initialState: { auth: { auth: { loading: false } } },
    })
    expect(screen.getByText(/ゲストページ/)).toBeInTheDocument()
  })

  it('roleがuserの場合はユーザーページがレンダリングされる', () => {
    render(<Home recipes={dummyRecipes} />, {
      initialState: { auth: user },
    })
    expect(screen.getByText(/ユーザーページ/)).toBeInTheDocument()
  })

  it('roleがadminの場合は管理者ページがレンダリングされる', () => {
    render(<Home recipes={dummyRecipes} />, {
      initialState: { auth: admin },
    })
    expect(screen.getByText(/管理者ページ/)).toBeInTheDocument()
  })
})
