/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '../../test-utils'
import { IUser } from '../../../re-ducks/auth/type'
import UsersList from '../../../components/admin/UsersList'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    }
  },
}))

const mockUsers: IUser[] = [
  {
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'dummy name',
    email: 'dummy@example.com',
    role: 'user',
    favoriteDish: 'dummy favoriteDish',
    specialDish: 'dummy specialDish',
    bio: 'dummy bio',
    recipes: [],
    recipeLikes: [],
    socials: [
      {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: 1,
        url: 'http://test',
      },
    ],
  },
  {
    id: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'dummy name2',
    email: 'dummy2@example.com',
    role: 'user',
    favoriteDish: 'dummy favoriteDish2',
    specialDish: 'dummy specialDish2',
    bio: 'dummy bio2',
    recipes: [],
    recipeLikes: [],
    socials: [
      {
        id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: 2,
        url: 'http://test2',
      },
    ],
  },
]

describe('レンダリング', () => {
  it('propsとして渡されるusersが正しく表示される', () => {
    render(<UsersList users={mockUsers} />)

    expect(screen.getByText('ユーザーリスト')).toBeInTheDocument()
    expect(screen.getByText('dummy name')).toBeInTheDocument()
    expect(screen.getByText('dummy name2')).toBeInTheDocument()
    expect(screen.getByText('戻る')).toBeInTheDocument()
  })
})
