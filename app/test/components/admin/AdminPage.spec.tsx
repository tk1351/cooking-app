/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '../../test-utils'
import { IUser } from '../../../re-ducks/auth/type'
import AdminPage from '../../../components/admin/AdminPage'

const mockAdmin: IUser = {
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'dummy name',
  email: 'dummy@example.com',
  role: 'admin',
  sub: 'dummy sub',
  picture: 'dummy picture',
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
      userId: 1,
    },
  ],
}

describe('レンダリング', () => {
  it('propsとして渡されるuserが正しく表示される', () => {
    render(<AdminPage user={mockAdmin} />)

    expect(screen.getByText(/dummy name/)).toBeInTheDocument()
    expect(screen.getByText(/dummy favoriteDish/)).toBeInTheDocument()
    expect(screen.getByText(/dummy specialDish/)).toBeInTheDocument()
    expect(screen.getByText(/dummy bio/)).toBeInTheDocument()

    expect(screen.getByText('プロフィール編集')).toBeInTheDocument()
    expect(screen.getByText('ユーザー一覧へ')).toBeInTheDocument()
  })
})
