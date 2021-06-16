/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '../../test-utils'
import { IUser } from '../../../re-ducks/auth/type'
import EditProfileForm from '../../../components/user/EditProfileForm'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: jest.fn(),
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
  bio: 'dummy',
  recipes: [],
  recipeLikes: [],
  socials: [],
}

describe('レンダリング', () => {
  it('formが正しく表示される', () => {
    render(<EditProfileForm user={mockUser} />)

    expect(screen.getByLabelText('ユーザー名')).toBeInTheDocument()
    expect(screen.getByLabelText('好きな料理')).toBeInTheDocument()
    expect(screen.getByLabelText('得意料理')).toBeInTheDocument()
    expect(screen.getByText('更新')).toBeTruthy()
  })

  it('inputにpropsとしてuserが渡されている', () => {
    render(<EditProfileForm user={mockUser} />)

    const nameInput = screen.getByLabelText('ユーザー名')
    const favoriteDishInput = screen.getByLabelText('好きな料理')
    const specialDishInput = screen.getByLabelText('得意料理')

    expect(nameInput).toHaveValue('dummy name')
    expect(favoriteDishInput).toHaveValue('dummy favoriteDish')
    expect(specialDishInput).toHaveValue('dummy specialDish')
  })
})
