/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen, act, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { render } from '../../test-utils'
import Login from '../../../components/auth/Login'

const mockLogin = jest.fn((email, password) => {
  return Promise.resolve({ email, password })
})

describe('レンダリング', () => {
  it('formが正しく表示される', () => {
    render(<Login />)
    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument()
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeTruthy()
  })
})

describe('LoginForm', () => {
  it('formが空の場合validationが機能する', async () => {
    await act(async () => render(<Login />))
    const button = screen.getByRole('button')

    await act(async () => {
      fireEvent.submit(button)
    })

    expect(
      screen.getByText('メールアドレスを入力してください')
    ).toBeInTheDocument()
    expect(screen.getByText('パスワードを入力してください')).toBeInTheDocument()

    expect(mockLogin).not.toBeCalled()
  })

  it('emailが正しい形式でない場合にvalidationが機能する', async () => {
    await act(async () => render(<Login />))
    const button = screen.getByRole('button')

    const emailInput = screen.getByLabelText('メールアドレス')
    await act(async () => {
      userEvent.type(emailInput, 'abcdefghijklmnopqrstuvwxyz')
      fireEvent.submit(button)
    })

    expect(emailInput).toHaveValue('abcdefghijklmnopqrstuvwxyz')
    expect(screen.getByText('正しい形式で入力してください')).toBeInTheDocument()
  })

  it('passwordが6文字以下の場合にvalidationが機能する', async () => {
    await act(async () => render(<Login />))
    const button = screen.getByRole('button')

    const passwordInput = screen.getByLabelText('パスワード')
    await act(async () => {
      userEvent.type(passwordInput, 'abc')
      fireEvent.submit(button)
    })

    expect(passwordInput).toHaveValue('abc')
    expect(
      screen.getByText('パスワードは6文字以上で入力してください')
    ).toBeInTheDocument()
  })

  it('passwordが20文字以上の場合にvalidationが機能する', async () => {
    await act(async () => render(<Login />))
    const button = screen.getByRole('button')

    const passwordInput = screen.getByLabelText('パスワード')
    await act(async () => {
      userEvent.type(passwordInput, 'abcdefghijklmnopqrstuvwxyz')
      fireEvent.submit(button)
    })

    expect(passwordInput).toHaveValue('abcdefghijklmnopqrstuvwxyz')
    expect(
      screen.getByText('パスワードは20文字以内で入力してください')
    ).toBeInTheDocument()
  })

  it('passwordが半角英小文字、半角英大文字、数字を各1種類以上含まない場合はvalidationが機能する', async () => {
    await act(async () => render(<Login />))
    const button = screen.getByRole('button')

    const passwordInput = screen.getByLabelText('パスワード')
    await act(async () => {
      userEvent.type(passwordInput, 'abcdef123')
      fireEvent.submit(button)
    })

    expect(passwordInput).toHaveValue('abcdef123')
    expect(
      screen.getByText(
        '半角英小文字、半角英大文字、数字を各1種類以上含んでください'
      )
    ).toBeInTheDocument()
  })

  it('正しい値が入っている場合にerrorが表示されない', async () => {
    await act(async () => render(<Login />))
    const button = screen.getByRole('button')

    const emailInput = screen.getByLabelText('メールアドレス')
    const passwordInput = screen.getByLabelText('パスワード')

    await act(async () => {
      userEvent.type(emailInput, 'test@example.com')
      userEvent.type(passwordInput, 'Abcdef123')
      fireEvent.submit(button)
    })

    expect(
      screen.queryByText('メールアドレスを入力してください')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText('パスワードを入力してください')
    ).not.toBeInTheDocument()
  })
})
