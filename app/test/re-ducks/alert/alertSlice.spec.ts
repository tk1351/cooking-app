import reducer, {
  setAlert,
  removeAlert,
} from '../../../re-ducks/alert/alertSlice'
import { IAlertState } from '../../../re-ducks/alert/type'

describe('alertReducerのテスト', () => {
  describe('setAlert', () => {
    let initialState: IAlertState[] = [
      { alertId: '', msg: '', alertType: undefined },
    ]

    it('setAlertが成功するとaction.payloadが追加される', () => {
      const payload: IAlertState = {
        alertId: '1',
        msg: 'payload',
        alertType: 'succeeded',
      }
      expect(initialState).toHaveLength(1)

      const action = { type: setAlert.type, payload }
      const state = reducer(initialState, action)
      expect(state).toHaveLength(2)
    })
  })

  describe('removeAlert', () => {
    let initialState: IAlertState[] = [
      { alertId: '', msg: '', alertType: undefined },
      { alertId: '1', msg: 'payload', alertType: 'succeeded' },
    ]

    it('removeAlertが成功するとpayloadのalertIdが一致するアラートがstateから削除される', () => {
      expect(initialState).toHaveLength(2)

      const action = { type: removeAlert.type, payload: { alertId: '1' } }
      const state = reducer(initialState, action)
      expect(state).toHaveLength(1)
      expect(state).toEqual([{ alertId: '', msg: '', alertType: undefined }])
    })
  })
})
