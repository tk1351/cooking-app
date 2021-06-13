import reducer, {
  createRecipe,
  likeRecipe,
  updateRecipe,
  deleteRecipe,
  unlikeRecipe,
} from '../../../re-ducks/recipe/recipeSlice'
import { IRecipeState, IRecipe } from '../../../re-ducks/recipe/type'
import { MyKnownError } from '../../../re-ducks/defaultType'

let initialState: IRecipeState = {
  recipe: null,
  recipes: [],
  loading: true,
  status: 'idle',
  error: null,
}

const recipe = {
  id: 1,
  name: 'dummy name',
  time: 5,
  remarks: 'dummy remarks',
  image: 'dummy image',
}

let deleteRecipeState = {
  recipe: {
    id: 1,
    name: 'dummy name',
    time: 5,
    remarks: 'dummy remarks',
    image: 'dummy image',
  },
  recipes: [],
  loading: false,
  status: 'idle',
  error: null,
}

describe('recipeReducerのテスト', () => {
  describe('createRecipe', () => {
    it('pending時はstatusがloadingとなる', () => {
      const action = { type: createRecipe.pending.type }
      const state = reducer(initialState, action)
      expect(state.status).toEqual('loading')
    })

    it('fulfilled時はpayloadとしてrecipeが返ってくる', () => {
      const action = { type: createRecipe.fulfilled.type, payload: recipe }
      const state = reducer(initialState, action)
      expect(state.recipe).toEqual(action.payload)
    })

    it('rejected時はpayloadとしてerrorが返ってくる', () => {
      const payload: MyKnownError = {
        statusCode: 400,
        error: 'dummy error',
        message: 'dummy message',
      }
      const action = { type: createRecipe.rejected.type, payload }
      const state = reducer(initialState, action)
      expect(state.error).toEqual(payload)
    })
  })

  describe('likeRecipe', () => {
    it('pending時はstatusがloadingとなる', () => {
      const action = { type: likeRecipe.pending.type }
      const state = reducer(initialState, action)
      expect(state.status).toEqual('loading')
    })

    it('fulfilled時はstatusがsucceededとなる', () => {
      const action = { type: likeRecipe.fulfilled.type }
      const state = reducer(initialState, action)
      expect(state.status).toEqual('succeeded')
    })

    it('rejected時はpayloadとしてerrorが返ってくる', () => {
      const payload: MyKnownError = {
        statusCode: 400,
        error: 'dummy error',
        message: 'dummy message',
      }
      const action = { type: likeRecipe.rejected.type, payload }
      const state = reducer(initialState, action)
      expect(state.error).toEqual(payload)
    })
  })

  describe('updateRecipe', () => {
    it('pending時はstatusがloadingとなる', () => {
      const action = { type: updateRecipe.pending.type }
      const state = reducer(initialState, action)
      expect(state.status).toEqual('loading')
    })

    it('fulfilled時はstatusがsucceededとなる', () => {
      const action = { type: updateRecipe.fulfilled.type }
      const state = reducer(initialState, action)
      expect(state.status).toEqual('succeeded')
    })

    it('rejected時はpayloadとしてerrorが返ってくる', () => {
      const payload: MyKnownError = {
        statusCode: 400,
        error: 'dummy error',
        message: 'dummy message',
      }
      const action = { type: updateRecipe.rejected.type, payload }
      const state = reducer(initialState, action)
      expect(state.error).toEqual(payload)
    })
  })

  describe('deleteRecipe', () => {
    it('pending時はstatusがloadingとなる', () => {
      const action = { type: deleteRecipe.pending.type }
      const state = reducer(initialState, action)
      expect(state.status).toEqual('loading')
    })

    it('fulfilled時は指定したrecipeがstateから除外される', () => {
      const action = { type: deleteRecipe.fulfilled.type, payload: { id: 1 } }
      const state = reducer(initialState, action)
      expect(state.status).toEqual('succeeded')
      expect(state.recipe).toBeNull()
    })

    it('rejected時はpayloadとしてerrorが返ってくる', () => {
      const payload: MyKnownError = {
        statusCode: 400,
        error: 'dummy error',
        message: 'dummy message',
      }
      const action = { type: deleteRecipe.rejected.type, payload }
      const state = reducer(initialState, action)
      expect(state.error).toEqual(payload)
    })
  })

  describe('unlikeRecipe', () => {
    it('pending時はstatusがloadingとなる', () => {
      const action = { type: unlikeRecipe.pending.type }
      const state = reducer(initialState, action)
      expect(state.status).toEqual('loading')
    })

    it('fulfilled時はstatusがsucceededとなる', () => {
      const action = { type: unlikeRecipe.fulfilled.type }
      const state = reducer(initialState, action)
      expect(state.status).toEqual('succeeded')
    })

    it('rejected時はpayloadとしてerrorが返ってくる', () => {
      const payload: MyKnownError = {
        statusCode: 400,
        error: 'dummy error',
        message: 'dummy message',
      }
      const action = { type: unlikeRecipe.rejected.type, payload }
      const state = reducer(initialState, action)
      expect(state.error).toEqual(payload)
    })
  })
})
