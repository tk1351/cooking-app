/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen, act, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { render } from '../../test-utils'
import Recipe from '../../../components/recipe/Recipe'
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

const mockRecipe: IRecipe = {
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
const user: OmitUser = {
  auth: {
    token: 'dummy token',
    loading: false,
    user: { id: 1, name: 'dummy name', role: 'user' },
    isAuthenticated: true,
  },
}

describe('レンダリング', () => {
  it('propsとして渡されるrecipeが正しく表示される', () => {
    render(<Recipe recipe={mockRecipe} />)

    expect(screen.getByText('dummy name')).toBeInTheDocument()
    expect(screen.getByText(/dummy remarks/)).toBeInTheDocument()
  })

  it('roleがadminの場合は編集と削除のボタンが表示される', () => {
    render(<Recipe recipe={mockRecipe} />, { initialState: { auth: admin } })
    expect(screen.getByText('編集')).toBeInTheDocument()
    expect(screen.getByText('削除')).toBeInTheDocument()
  })

  it('roleがuserの場合はお気に入りボタンが表示される', () => {
    render(<Recipe recipe={mockRecipe} />, { initialState: { auth: user } })
    expect(screen.getByText('○')).toBeInTheDocument()
  })
})
