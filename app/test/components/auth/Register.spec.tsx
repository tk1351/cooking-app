/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen, act, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { render } from '../../test-utils'
import Register from '../../../components/auth/Register'

const mockRegisterUser = jest.fn((name, email, password) => {
  return Promise.resolve({ name, email, password })
})

describe('レンダリング', () => {
  it('formが正しく表示される', () => {
    render(<Register />)
    expect(screen.getByLabelText('ユーザー名')).toBeInTheDocument()
    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument()
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument()
    expect(screen.getByLabelText('パスワード（確認用）')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeTruthy()
  })
})

describe('RegisterForm', () => {
  it('formが空の場合validationが機能する', async () => {
    await act(async () => render(<Register />))
    const button = screen.getByRole('button')

    await act(async () => {
      fireEvent.submit(button)
    })

    expect(screen.getByText('ユーザー名を入力してください')).toBeInTheDocument()
    expect(
      screen.getByText('メールアドレスを入力してください')
    ).toBeInTheDocument()
    expect(screen.getByText('パスワードを入力してください')).toBeInTheDocument()
    expect(
      screen.getByText('パスワード（確認用）を入力してください')
    ).toBeInTheDocument()

    expect(mockRegisterUser).not.toBeCalled()
  })

  it('nameの字数が4文字以下の場合にvalidationが機能する', async () => {
    await act(async () => render(<Register />))
    const button = screen.getByRole('button')

    const nameInput = screen.getByLabelText('ユーザー名')
    await act(async () => {
      userEvent.type(nameInput, 'abc')
      fireEvent.submit(button)
    })

    expect(nameInput).toHaveValue('abc')
    expect(
      screen.getByText('ユーザー名は4字以上入力してください')
    ).toBeInTheDocument()
  })

  it('nameの字数が20文字以上の場合にvalidationが機能する', async () => {
    await act(async () => render(<Register />))
    const button = screen.getByRole('button')

    const nameInput = screen.getByLabelText('ユーザー名')
    await act(async () => {
      userEvent.type(nameInput, 'abcdefghijklmnopqrstuvwxyz')
      fireEvent.submit(button)
    })

    expect(nameInput).toHaveValue('abcdefghijklmnopqrstuvwxyz')
    expect(
      screen.getByText('ユーザー名は20字以内で入力してください')
    ).toBeInTheDocument()
  })

  it('emailが正しい形式でない場合にvalidationが機能する', async () => {
    await act(async () => render(<Register />))
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
    await act(async () => render(<Register />))
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
    await act(async () => render(<Register />))
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
    await act(async () => render(<Register />))
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

  it('passowrdとconfirmPasswordが一致しない場合はvalidationが機能する', async () => {
    await act(async () => render(<Register />))
    const button = screen.getByRole('button')

    const passwordInput = screen.getByLabelText('パスワード')
    const confirmPasswordInput = screen.getByLabelText('パスワード（確認用）')
    await act(async () => {
      userEvent.type(passwordInput, 'Abcdef123')
      userEvent.type(confirmPasswordInput, 'Abcdef12')
      fireEvent.submit(button)
    })

    expect(passwordInput).toHaveValue('Abcdef123')
    expect(confirmPasswordInput).toHaveValue('Abcdef12')
    expect(screen.getByText('パスワードが一致しません')).toBeInTheDocument()
  })

  it('正しい値が入っている場合にerrorが表示されない', async () => {
    await act(async () => render(<Register />))
    const button = screen.getByRole('button')

    const nameInput = screen.getByLabelText('ユーザー名')
    const emailInput = screen.getByLabelText('メールアドレス')
    const passwordInput = screen.getByLabelText('パスワード')
    const confirmPasswordInput = screen.getByLabelText('パスワード（確認用）')

    await act(async () => {
      userEvent.type(nameInput, 'test')
      userEvent.type(emailInput, 'test@example.com')
      userEvent.type(passwordInput, 'Abcdef123')
      userEvent.type(confirmPasswordInput, 'Abcdef123')
      fireEvent.submit(button)
    })

    expect(
      screen.queryByText('ユーザー名を入力してください')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText('メールアドレスを入力してください')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText('パスワードを入力してください')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText('パスワードが一致しません')
    ).not.toBeInTheDocument()
  })
})
