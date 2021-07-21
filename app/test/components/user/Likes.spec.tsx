/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '../../test-utils'
import Likes from '../../../components/user/Likes'
import { IUser } from '../../../re-ducks/auth/type'
import { IRecipeLike } from '../../../re-ducks/defaultType'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      query: { userId: 1 },
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
  sub: 'dummy sub',
  picture: 'dummy picture',
  favoriteDish: 'dummy',
  specialDish: 'dummy',
  bio: 'dummy',
  recipes: [],
  recipeLikes: [],
  socials: [],
}

const mockRecipeLikes: IRecipeLike[] = [
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
      url: 'https://',
      remarks: 'dummy remarks',
      image: 'dummy image',
      ingredients: [],
      recipeDescriptions: [],
      recipeLikes: [],
      tags: [],
      user: dummyUser,
    },
  },
]

describe('レンダリング', () => {
  it('propsとして渡されるuserのlikesが正しく表示される', () => {
    render(<Likes recipeLikes={mockRecipeLikes} />)

    expect(screen.getByText(/お気に入りレシピ一覧/)).toBeInTheDocument()
    expect(screen.getByText('dummy name')).toBeInTheDocument()
    expect(screen.getByText('詳細')).toBeInTheDocument()
  })
})
