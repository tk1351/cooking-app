import { ReactElement, ComponentType } from 'react'
import {
  render as rtlRender,
  RenderOptions as RtlRenderOptions,
} from '@testing-library/react'
import { configureStore, Store } from '@reduxjs/toolkit'
import { DeepPartial } from 'redux'
import { Provider } from 'react-redux'
import { reducer, RootState } from '../re-ducks/store'

type RenderOptions = {
  initialState?: DeepPartial<RootState>
  store?: Store
} & RtlRenderOptions

export const render = (
  component: ReactElement,
  { initialState, store: s, ...renderOptions }: RenderOptions = {}
) => {
  const store = s ?? configureStore({ reducer, preloadedState: initialState })

  const Wrapper = ({ children }: { children: ReactElement }) => {
    return <Provider store={store}>{children}</Provider>
  }

  return {
    ...rtlRender(component, {
      wrapper: Wrapper as ComponentType,
      ...renderOptions,
    }),
    store,
  }
}
