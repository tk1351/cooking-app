/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen, act, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { render } from '../../test-utils'
import FormButton, {
  IFormButtonProps,
} from '../../../components/form/FormButton'

describe('レンダリング', () => {
  const mockProps: IFormButtonProps = {
    variant: 'contained',
    color: 'default',
    label: 'dummy',
    type: 'button',
  }
  it('buttonとlabelが存在する', () => {
    render(<FormButton {...mockProps} />)
    expect(screen.getByRole('button')).toBeTruthy()
    expect(screen.getByText('dummy')).toBeInTheDocument()
  })
})
