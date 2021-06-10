export interface IAlertState {
  id: string
  msg: string
  alertType: 'succeeded' | 'failed'
}
