/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '../../test-utils'
import Navbar from '../../../components/common/Navbar'
import { IAuthState } from '../../../re-ducks/auth/type'

type OmitUser = Omit<IAuthState, 'status' | 'message' | 'error'>

const user: OmitUser = {
  auth: {
    token: 'dummy token',
    loading: false,
    user: { id: 1, name: 'dummy name', role: 'user' },
    isAuthenticated: true,
  },
}

const admin: OmitUser = {
  auth: {
    token: 'dummy token',
    loading: false,
    user: { id: 1, name: 'dummy name', role: 'admin' },
    isAuthenticated: true,
  },
}

describe('条件付きレンダー', () => {
  it('ゲストの場合、ユーザー登録とログインが表示される', async () => {
    render(<Navbar />, { initialState: { auth: { auth: { loading: false } } } })
    expect(await screen.findByText(/ユーザー登録/)).toBeInTheDocument()
    expect(await screen.findByText(/ログイン/)).toBeInTheDocument()
  })

  it('roleがuserの場合、正しくレンダリングされる', async () => {
    render(<Navbar />, {
      initialState: {
        auth: user,
      },
    })
    expect(await screen.findByText(/マイページ/)).toBeInTheDocument()
    expect(await screen.findByText(/お気に入り/)).toBeInTheDocument()
    expect(await screen.findByText(/ログアウト/)).toBeInTheDocument()
  })

  it('roleがadminの場合、正しくレンダリングされる', async () => {
    render(<Navbar />, {
      initialState: {
        auth: admin,
      },
    })
    expect(await screen.findByText(/管理者ページ/)).toBeInTheDocument()
    expect(await screen.findByText(/レシピ投稿/)).toBeInTheDocument()
    expect(await screen.findByText(/ログアウト/)).toBeInTheDocument()
  })
})
