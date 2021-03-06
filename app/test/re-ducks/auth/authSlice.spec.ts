import reducer, {
  fetchCurrentUser,
  logout,
  updateAdminProfile,
  updateUserProfile,
  deleteUserWithAdminPriviledge,
} from '../../../re-ducks/auth/authSlice'
import { IAuthState, ICurrentUser } from '../../../re-ducks/auth/type'
import { MyKnownError } from '../../../re-ducks/defaultType'

const localStorageMock = (() => {
  let store = {}

  return {
    getItem() {
      return store || null
    },
    removeItem() {
      return null
    },
  }
})()

global.localStorage = localStorageMock as any

let initialState: IAuthState = {
  auth: {
    token: null,
    isAuthenticated: false,
    loading: true,
    user: null,
  },
  status: 'idle',
  message: null,
  error: null,
}

let roleUserState: IAuthState = {
  auth: {
    token: 'dummy token',
    isAuthenticated: true,
    loading: false,
    user: { id: 1, name: 'dummy name', role: 'user' },
  },
  status: 'succeeded',
  message: null,
  error: null,
}

let roleAdminState: IAuthState = {
  auth: {
    token: 'dummy token',
    isAuthenticated: true,
    loading: false,
    user: { id: 1, name: 'dummy name', role: 'admin' },
  },
  status: 'succeeded',
  message: null,
  error: null,
}

let currentUser: ICurrentUser = {
  user: {
    id: 1,
    name: 'testName',
    role: 'user',
  },
  accessToken: 'test',
}

describe('authReducerのテスト', () => {
  describe('fetchCurrentUser', () => {
    it('pending時はstatusがloadingとなる', () => {
      const action = { type: fetchCurrentUser.pending.type }
      const state = reducer(roleUserState, action)
      expect(state.status).toEqual('loading')
    })

    it('fulfilled時はpayloadのuser情報が渡される', () => {
      const payload = {
        user: {
          id: 1,
          name: 'testName',
          role: 'user',
        },
      }
      const action = {
        type: fetchCurrentUser.fulfilled.type,
        payload,
      }
      const state = reducer(roleUserState, action)
      expect(state.auth.user).toEqual(currentUser.user)
    })

    it('rejected時はpayloadのerrorが渡される', () => {
      const payload: MyKnownError = {
        statusCode: 400,
        error: 'dummy error',
        message: 'dummy message',
      }
      const action = { type: fetchCurrentUser.rejected.type, payload }
      const state = reducer(roleUserState, action)
      expect(state.error).toEqual(payload)
    })
  })

  describe('logout', () => {
    it('logoutが成功するとstateが空になる', () => {
      const action = { type: logout.type }
      const state = reducer(roleUserState, action)
      expect(state.status).toEqual('idle')
      expect(state.auth.token).toBeNull()
      expect(state.auth.user).toBeNull()
      expect(state.auth.isAuthenticated).toBeFalsy()
      expect(state.auth.loading).toBeTruthy()
    })
  })

  describe('updateAdminProfile', () => {
    it('pending時はstatusがloadingとなる', () => {
      const action = { type: updateAdminProfile.pending.type }
      const state = reducer(roleAdminState, action)
      expect(state.status).toEqual('loading')
    })

    it('fulfilled時はstatusがsucceededとなる', () => {
      const action = { type: updateAdminProfile.fulfilled.type }
      const state = reducer(roleAdminState, action)
      expect(state.status).toEqual('succeeded')
    })

    it('rejected時はpayloadのerrorが返ってくる', () => {
      const payload: MyKnownError = {
        statusCode: 400,
        error: 'dummy error',
        message: 'dummy message',
      }
      const action = { type: updateAdminProfile.rejected.type, payload }
      const state = reducer(roleAdminState, action)
      expect(state.error).toEqual(payload)
    })
  })

  describe('updateUserProfile', () => {
    it('pending時はstatusがloadingとなる', () => {
      const action = { type: updateUserProfile.pending.type }
      const state = reducer(roleUserState, action)
      expect(state.status).toEqual('loading')
    })

    it('fulfilled時はstatusがsucceededとなる', () => {
      const action = { type: updateUserProfile.fulfilled.type }
      const state = reducer(roleUserState, action)
      expect(state.status).toEqual('succeeded')
    })

    it('rejected時はpayloadのerrorが返ってくる', () => {
      const payload: MyKnownError = {
        statusCode: 400,
        error: 'dummy error',
        message: 'dummy message',
      }
      const action = { type: updateUserProfile.rejected.type, payload }
      const state = reducer(roleUserState, action)
      expect(state.error).toEqual(payload)
    })
  })

  describe('deleteUserWithAdminPriviledge', () => {
    it('pending時はstatusがloadingとなる', () => {
      const action = { type: deleteUserWithAdminPriviledge.pending.type }
      const state = reducer(roleUserState, action)
      expect(state.status).toEqual('loading')
    })

    it('fulfilled時はstatusがsucceededとなる', () => {
      const action = { type: deleteUserWithAdminPriviledge.fulfilled.type }
      const state = reducer(roleUserState, action)
      expect(state.status).toEqual('succeeded')
    })

    it('rejected時はpayloadのerrorが返ってくる', () => {
      const payload: MyKnownError = {
        statusCode: 400,
        error: 'dummy error',
        message: 'dummy message',
      }
      const action = {
        type: deleteUserWithAdminPriviledge.rejected.type,
        payload,
      }
      const state = reducer(roleUserState, action)
      expect(state.error).toEqual(payload)
    })
  })
})
