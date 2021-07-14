/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '../../test-utils'
import Login from '../../../components/auth/Login'

describe('レンダー', () => {
  it('h1とbuttonがレンダリングされている', async () => {
    render(<Login />)
    expect(await screen.findByRole('heading')).toBeInTheDocument()
    expect(await screen.findByRole('button')).toBeInTheDocument()
  })
})
