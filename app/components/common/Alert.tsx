import React, { VFC, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../re-ducks/hooks'
import { selectAlert, removeAlert } from '../../re-ducks/alert/alertSlice'
import { SnackbarOrigin, Snackbar } from '@material-ui/core'

export interface State extends SnackbarOrigin {
  open: boolean
}

const Alert: VFC = () => {
  const alerts = useAppSelector(selectAlert)
  const dispatch = useAppDispatch()

  const [state, setState] = useState<State>({
    open: true,
    vertical: 'top',
    horizontal: 'right',
  })

  const { vertical, horizontal, open } = state

  const handleClose = () => {
    setState({ ...state, open: false })
    const alertId = alerts[1].alertId
    dispatch(removeAlert({ alertId }))
  }

  const isAlert = alerts.map(
    (alert) =>
      alert.alertType && (
        <div key={alert.alertId}>
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            onClose={handleClose}
            message={alert.msg}
            key={vertical + horizontal}
          />
        </div>
      )
  )
  return <div>{isAlert}</div>
}

export default Alert
