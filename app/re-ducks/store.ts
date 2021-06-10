import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'
import recipeReducer from './recipe/recipeSlice'
import alertReducer from './alert/alertSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    recipe: recipeReducer,
    alert: alertReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AsyncThunkConfig<T = unknown> = {
  state: RootState
  dispatch: AppDispatch
  extra: unknown
  rejectValue: T
}
