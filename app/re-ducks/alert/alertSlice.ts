import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { IAlertState } from './type'

const initialState: IAlertState[] = [
  {
    id: '',
    msg: '',
    alertType: '',
  },
]

export const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlert: (state, action: PayloadAction<IAlertState>) => {
      return [...state, action.payload]
    },
    removeAlert: (state, action: PayloadAction<{ id: string }>) => {
      return state.filter((alert) => alert.id !== action.payload.id)
    },
  },
})

export const { setAlert, removeAlert } = alertSlice.actions
export const selectAlert = (state: RootState) => state.alert

export default alertSlice.reducer

// const alertCheck = async () => {
//   await dispatch(
//     setAlert({
//       id: '1',
//       msg: '動作確認',
//       alertType: 'ok',
//     })
//   )
//   setTimeout(async () => await dispatch(removeAlert({ id: '1' })), 3000)
// }
