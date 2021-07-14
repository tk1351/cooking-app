/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '../../test-utils'
import TextForm, { ITextFormProps } from '../../../components/form/TextForm'

const onChange = (e: any[]) => {
  return e
}

const mockProps: ITextFormProps = {
  id: 'props',
  label: 'props',
  type: 'text',
  name: 'props',
  variant: 'filled',
  onChange: onChange,
  error: false,
  helperText: undefined,
}

describe('レンダリング', () => {
  it('labelが正しく表示されている', () => {
    render(<TextForm {...mockProps} />)
    expect(screen.getByLabelText('props')).toBeInTheDocument()
  })
})
