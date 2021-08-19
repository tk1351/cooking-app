export interface IAlertState {
  open: boolean
  msg: string
  alertType: 'succeeded' | 'failed' | undefined
}
