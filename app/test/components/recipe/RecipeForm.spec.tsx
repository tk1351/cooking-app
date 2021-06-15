/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen, act, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { render } from '../../test-utils'
import RecipeForm from '../../../components/recipe/RecipeForm'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    }
  },
}))

describe('レンダリング', () => {
  it('formが正しく表示される', () => {
    render(<RecipeForm />)

    expect(screen.getByLabelText('レシピ名')).toBeInTheDocument()
    expect(screen.getByLabelText('調理時間')).toBeInTheDocument()
    expect(screen.getByLabelText('材料名')).toBeInTheDocument()
    expect(screen.getByLabelText('分量')).toBeInTheDocument()
    expect(screen.getByLabelText('順番')).toBeInTheDocument()
    expect(screen.getByLabelText('詳細')).toBeInTheDocument()
    expect(screen.getByLabelText('URL')).toBeInTheDocument()
    expect(screen.getByLabelText('タグ名')).toBeInTheDocument()
    expect(screen.getByLabelText('補足')).toBeInTheDocument()
    expect(screen.getByText('投稿')).toBeInTheDocument()
  })
})

describe('RecipeForm', () => {
  it('formが空の場合validationが機能する', async () => {
    await act(async () => render(<RecipeForm />))
    const button = screen.getByText('投稿')

    await act(async () => {
      fireEvent.submit(button)
    })

    expect(screen.getByText('レシピ名を入力してください')).toBeInTheDocument()
    expect(screen.getByText('材料名を入力してください')).toBeInTheDocument()
    expect(screen.getByText('分量を入力してください')).toBeInTheDocument()
    expect(
      screen.getByText('調理工程の詳細を入力してください')
    ).toBeInTheDocument()
  })

  it('正しい値が入っている場合にerrorが表示されない', async () => {
    await act(async () => render(<RecipeForm />))
    const button = screen.getByText('投稿')

    const nameInput = screen.getByLabelText('レシピ名')
    const ingredientsNameInput = screen.getByLabelText('材料名')
    const ingredientsAmountInput = screen.getByLabelText('分量')
    const recipeDescriptionTextInput = screen.getByLabelText('詳細')
    const urlInput = screen.getByLabelText('URL')
    const remarksInput = screen.getByLabelText('補足')
    await act(async () => {
      userEvent.type(nameInput, 'test')
      userEvent.type(ingredientsNameInput, 'test')
      userEvent.type(ingredientsAmountInput, 'test')
      userEvent.type(recipeDescriptionTextInput, 'test')
      userEvent.type(urlInput, 'http://test')
      userEvent.type(remarksInput, 'test')
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
