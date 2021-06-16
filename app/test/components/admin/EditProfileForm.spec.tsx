/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '../../test-utils'
import EditProfileForm from '../../../components/admin/EditProfileForm'
import { IUser } from '../../../re-ducks/auth/type'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    }
  },
}))

const mockAdmin: IUser = {
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'dummy name',
  email: 'dummy@example.com',
  role: 'admin',
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
  it('formが正しく表示される', () => {
    render(<EditProfileForm user={mockAdmin} />)

    expect(screen.getByLabelText('ユーザー名')).toBeInTheDocument()
    expect(screen.getByLabelText('好きな料理')).toBeInTheDocument()
    expect(screen.getByLabelText('得意料理')).toBeInTheDocument()
    expect(screen.getByLabelText('自己紹介')).toBeInTheDocument()
    expect(screen.getByLabelText('SNS')).toBeInTheDocument()
    expect(screen.getByLabelText('URL')).toBeInTheDocument()
    expect(screen.getByText('更新')).toBeInTheDocument()
  })

  it('propsとして渡されるuserが正しく表示される', () => {
    render(<EditProfileForm user={mockAdmin} />)

    const nameInput = screen.getByLabelText('ユーザー名')
    const favoriteDishInput = screen.getByLabelText('好きな料理')
    const specialDishInput = screen.getByLabelText('得意料理')
    const bioInput = screen.getByLabelText('自己紹介')
    const urlInput = screen.getByLabelText('URL')

    expect(nameInput).toHaveValue('dummy name')
    expect(favoriteDishInput).toHaveValue('dummy favoriteDish')
    expect(specialDishInput).toHaveValue('dummy specialDish')
    expect(bioInput).toHaveValue('dummy bio')
    expect(urlInput).toHaveValue('http://test')
  })
})
