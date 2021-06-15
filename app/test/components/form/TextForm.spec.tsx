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
  head: 'dummy head',
  id: 'props',
  label: 'props',
  placeholder: 'dummy placeholder',
  type: 'text',
  name: 'props',
  variant: 'filled',
  onChange: onChange,
  error: false,
  helperText: undefined,
}

describe('レンダリング', () => {
  it('spanとinputが正しく表示されている', () => {
    render(<TextForm {...mockProps} />)
    expect(screen.getByText('dummy head')).toBeInTheDocument()
    expect(screen.getByLabelText('props')).toBeInTheDocument()
  })
})
