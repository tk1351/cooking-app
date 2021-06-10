import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { IAlertState } from './type'

const initialState: IAlertState[] = [
  {
    alertId: '',
    msg: '',
    alertType: undefined,
  },
]

export const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlert: (state, action: PayloadAction<IAlertState>) => {
      return [...state, action.payload]
    },
    removeAlert: (state, action: PayloadAction<{ alertId: string }>) => {
      return state.filter((alert) => alert.alertId !== action.payload.alertId)
    },
  },
})

export const { setAlert, removeAlert } = alertSlice.actions
export const selectAlert = (state: RootState) => state.alert

export default alertSlice.reducer
