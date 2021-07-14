import reducer, {
  setRecipe,
  removeRecipe,
} from '../../../re-ducks/confirmation/confirmationSlice'
import { IConfimationState } from '../../../re-ducks/confirmation/type'
import { IRecipeInputs } from '../../../components/form/type'

let initialState: IConfimationState = {
  recipe: {
    name: '',
    time: 5,
    remarks: '',
    url: '',
    ingredients: [
      {
        name: '',
        amount: '',
      },
    ],
    recipeDescriptions: [
      {
        order: 1,
        text: '',
        url: '',
      },
    ],
    tags: [{ name: '' }],
  },
}

describe('confirmationReducerのテスト', () => {
  describe('setRecipe', () => {
    it('setRecipeが成功するとaction.payloadが追加される', () => {
      const payload: IRecipeInputs = {
        name: 'testName',
        time: 10,
        remarks: 'test',
        url: 'https://',
        ingredients: [{ name: 'test', amount: 'test' }],
        recipeDescriptions: [{ order: 1, text: 'test', url: 'https://' }],
        tags: [{ name: 'test' }],
      }
      const action = { type: setRecipe.type, payload }
      const state = reducer(initialState, action)
      expect(state.recipe).toEqual(action.payload)
    })
  })

  describe('removeRecipe', () => {
    it('removeRecipeが成功するとstateが空になる', () => {
      let recipeState: IConfimationState = {
        recipe: {
          name: 'testName',
          time: 10,
          remarks: 'test',
          url: 'https://',
          ingredients: [{ name: 'test', amount: 'test' }],
          recipeDescriptions: [{ order: 1, text: 'test', url: 'https://' }],
          tags: [{ name: 'test' }],
        },
      }

      const action = { type: removeRecipe.type }
      const state = reducer(recipeState, action)
      expect(state.recipe).toEqual(initialState.recipe)
    })
  })
})
