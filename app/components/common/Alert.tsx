import React, { VFC, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../re-ducks/hooks'
import { selectAlert, removeAlert } from '../../re-ducks/alert/alertSlice'
import { SnackbarOrigin, Snackbar } from '@material-ui/core'

const Alert: VFC = () => {
  const alert = useAppSelector(selectAlert)
  const dispatch = useAppDispatch()

  const [state, setState] = useState<SnackbarOrigin>({
    vertical: 'bottom',
    horizontal: 'right',
  })

  const { vertical, horizontal } = state

  const handleClose = () => {
    setState({ ...state })
    dispatch(removeAlert())
  }

  return (
    <>
      {alert.open === true && (
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={alert.open}
          message={alert.msg}
          key={vertical + horizontal}
          onClose={handleClose}
        />
      )}
    </>
  )
}

export default Alert
