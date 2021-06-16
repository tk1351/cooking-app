/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '../../test-utils'
import UserInfo from '../../../components/admin/UserInfo'
import { IUser } from '../../../re-ducks/auth/type'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      back: jest.fn(),
    }
  },
}))

const mockUser: IUser = {
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
}

describe('レンダリング', () => {
  it('propsとして渡されるuserが正しく表示される', () => {
    render(<UserInfo user={mockUser} />)

    expect(screen.getByText(/dummy name/)).toBeInTheDocument()
    expect(screen.getByText(/dummy favoriteDish/)).toBeInTheDocument()
    expect(screen.getByText(/dummy specialDish/)).toBeInTheDocument()
    expect(screen.getByText('ユーザーを削除する')).toBeInTheDocument()
    expect(screen.getByText('ユーザーリストへ戻る')).toBeInTheDocument()
  })
})
