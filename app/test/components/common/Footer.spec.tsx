/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '../../test-utils'
import Footer from '../../../components/common/Footer'

describe('レンダー', () => {
  it('buttonタグが正しくレンダリングされている', async () => {
    render(<Footer />)
    expect(await screen.findByRole('button')).toBeInTheDocument()
  })
})
