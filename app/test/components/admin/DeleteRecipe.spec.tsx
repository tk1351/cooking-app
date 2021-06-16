/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '../../test-utils'
import DeleteRecipe from '../../../components/admin/DeleteRecipe'
import { IUser } from '../../../re-ducks/auth/type'
import { IRecipe } from '../../../re-ducks/recipe/type'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    }
  },
}))

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
  ingredients: [
    {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'dummy name',
      amount: 'dummy amount',
      recipeId: 1,
    },
  ],
  recipeDescriptions: [
    {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      order: 1,
      text: 'dummy text',
      url: 'http://test',
    },
  ],
  recipeLikes: [],
  tags: [
    {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'dummy name',
      recipeId: 1,
    },
  ],
  user: dummyUser,
}

describe('レンダリング', () => {
  it('propsとして渡されるrecipeが正しく表示される', () => {
    render(<DeleteRecipe recipe={mockRecipe} />)

    expect(screen.getByText('dummy nameを削除しますか？'))
  })
})
