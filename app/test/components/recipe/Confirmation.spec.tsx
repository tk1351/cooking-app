/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '../../test-utils'
import Confirmation from '../../../components/recipe/Confirmation'

describe('レンダリング', () => {
  it('textが正しく表示される', () => {
    render(<Confirmation />)

    expect(screen.getByText(/料理画像/)).toBeInTheDocument()
    expect(screen.getByText(/調理時間/)).toBeInTheDocument()
    expect(screen.getByText(/材料/)).toBeInTheDocument()
    expect(screen.getByText(/調理工程/)).toBeInTheDocument()
    expect(screen.getByText(/編集する/)).toBeInTheDocument()
    expect(screen.getByText(/投稿する/)).toBeInTheDocument()
    expect(screen.getByText(/戻る/)).toBeInTheDocument()
  })
})
