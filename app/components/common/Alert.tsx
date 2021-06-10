import React, { VFC } from 'react'
import { useAppSelector } from '../../re-ducks/hooks'
import { selectAlert } from '../../re-ducks/alert/alertSlice'

const Alert: VFC = () => {
  const alerts = useAppSelector(selectAlert)
  const isAlert = alerts.map((alert) =>
    alert.alertType ? <div key={alert.id}>{alert.msg}</div> : <></>
  )
  return <div>{isAlert}</div>
}

export default Alert
