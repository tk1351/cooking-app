/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '../../test-utils'
import Likes from '../../../components/user/Likes'
import { IUser } from '../../../re-ducks/auth/type'

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

const mockUser: IUser = {
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'dummy name',
  email: 'dummy@example.com',
  role: 'user',
  favoriteDish: 'dummy favoriteDish',
  specialDish: 'dummy specialDish',
  bio: 'dummy',
  recipes: [],
  recipeLikes: [
    {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1,
      recipeId: 1,
      recipe: {
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
    },
  ],
  socials: [],
}

describe('レンダリング', () => {
  it('propsとして渡されるuserのlikesが正しく表示される', () => {
    render(<Likes user={mockUser} />)

    expect(screen.getByText(/お気に入りレシピ一覧/)).toBeInTheDocument()
    expect(screen.getByText('dummy name')).toBeInTheDocument()
    expect(screen.getByText('詳細')).toBeInTheDocument()
  })
})
