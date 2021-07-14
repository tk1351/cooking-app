/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen, act, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '../../test-utils'
import EditRecipeForm from '../../../components/recipe/EditRecipeForm'
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
  url: 'https://',
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
  it('formが正しく表示される', () => {
    render(<EditRecipeForm recipe={mockRecipe} />)

    expect(screen.getByLabelText('レシピ名')).toBeInTheDocument()
    expect(screen.getByLabelText('調理時間')).toBeInTheDocument()
    expect(screen.getByLabelText('材料名')).toBeInTheDocument()
    expect(screen.getByLabelText('分量')).toBeInTheDocument()
    expect(screen.getByLabelText('順番')).toBeInTheDocument()
    expect(screen.getByLabelText('詳細')).toBeInTheDocument()
    expect(screen.getByLabelText('URL')).toBeInTheDocument()
    expect(screen.getByLabelText('タグ名')).toBeInTheDocument()
    expect(screen.getByLabelText('補足')).toBeInTheDocument()
    expect(screen.getByText('編集')).toBeInTheDocument()
  })
})

describe('EditRecipeForm', () => {
  it('正しい値が入っている場合にerrorが表示されない', async () => {
    await act(async () => render(<EditRecipeForm recipe={mockRecipe} />))
    const button = screen.getByText('編集')

    await act(async () => {
      fireEvent.submit(button)
    })

    expect(
      screen.queryByText('レシピ名を入力してください')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText('材料名を入力してください')
    ).not.toBeInTheDocument()
    expect(screen.queryByText('分量を入力してください')).not.toBeInTheDocument()
    expect(
      screen.queryByText('調理工程の詳細を入力してください')
    ).not.toBeInTheDocument()
  })
})
