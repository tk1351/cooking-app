import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'
import recipeReducer from './recipe/recipeSlice'
import alertReducer from './alert/alertSlice'
import confirmationReducer from './confirmation/confirmationSlice'

export const reducer = {
  auth: authReducer,
  recipe: recipeReducer,
  alert: alertReducer,
  confirmation: confirmationReducer,
}

export const store = configureStore({
  reducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AsyncThunkConfig<T = unknown> = {
  state: RootState
  dispatch: AppDispatch
  extra: unknown
  rejectValue: T
}
