export interface IAlertState {
  alertId: string
  msg: string
  alertType: 'succeeded' | 'failed' | undefined
}
