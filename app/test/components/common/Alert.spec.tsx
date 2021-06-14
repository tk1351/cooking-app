/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render } from '../../test-utils'
import Alert from '../../../components/common/Alert'
import { IAlertState } from '../../../re-ducks/alert/type'

const alert: IAlertState[] = [
  {
    alertId: '1',
    msg: 'dummy',
    alertType: 'succeeded',
  },
]

describe('レンダリング', () => {
  it('alertTypeが存在する場合は正しくmsgが表示される', () => {
    render(<Alert />, { initialState: { alert } })
    expect(screen.getByText(/dummy/)).toBeInTheDocument()
  })

  it('alertTypeが存在しない場合はmsgがレンダリングされない', () => {
    render(<Alert />)
    expect(screen.queryByText(/dummy/)).not.toBeInTheDocument()
  })
})
