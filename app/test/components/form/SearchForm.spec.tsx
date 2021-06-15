/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen, act, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { render } from '../../test-utils'
import SearchForm from '../../../components/form/SearchForm'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    }
  },
}))

describe('レンダリング', () => {
  it('inputとbuttonが正しく表示されている', () => {
    render(<SearchForm />)
    expect(screen.getByTestId('query')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeTruthy()
  })
})

describe('SearchForm', () => {
  it('SearchFormが正しく機能する', async () => {
    await act(async () => render(<SearchForm />))
    const button = screen.getByRole('button')

    const queryInput = screen.getByTestId('query')
    await act(async () => {
      userEvent.type(queryInput, 'test')
      fireEvent.submit(button)
    })

    expect(queryInput).toHaveValue('test')
  })
})
