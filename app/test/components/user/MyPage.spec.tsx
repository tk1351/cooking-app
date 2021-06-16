/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '../../test-utils'
import MyPage from '../../../components/user/MyPage'
import { IUser } from '../../../re-ducks/auth/type'

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
  recipeLikes: [],
  socials: [],
}

describe('レンダリング', () => {
  it('propsとして渡されるuserが正しく表示される', () => {
    render(<MyPage user={mockUser} />)

    expect(screen.getByText(/dummy name/)).toBeInTheDocument()
    expect(screen.getByText(/dummy favoriteDish/)).toBeInTheDocument()
    expect(screen.getByText(/dummy specialDish/)).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeTruthy()
  })
})
