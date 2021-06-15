/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '../../test-utils'
import { IUser } from '../../../re-ducks/auth/type'
import { IRecipe } from '../../../re-ducks/recipe/type'
import Tag from '../../../components/recipe/Tag'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      query: 'test',
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

const mockRecipes: IRecipe[] = [
  {
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
  {
    id: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'dummy name2',
    time: 5,
    remarks: 'dummy remarks2',
    image: 'dummy image2',
    ingredients: [],
    recipeDescriptions: [],
    recipeLikes: [],
    tags: [],
    user: dummyUser,
  },
]

describe('レンダリング', () => {
  it('propsとして渡されるrecipesが正しく表示される', () => {
    render(<Tag recipes={mockRecipes} />)

    expect(screen.getByText(/検索結果/)).toBeInTheDocument()
    expect(screen.getByText('dummy name')).toBeInTheDocument()
    expect(screen.getByText('dummy name2')).toBeInTheDocument()
  })
})
