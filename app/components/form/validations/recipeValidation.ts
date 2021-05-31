import * as yup from 'yup'

const requireName = 'レシピ名を入力してください'
const requireTime = '調理時間を入力してください'
const requireIngredientName = '材料名を入力してください'
const requireIngredientAmount = '分量を入力してください'
const requireRecipeDescriptionOrder = '調理工程の順番を入力してください'
const requireRecipeDescriptionText = '調理工程の詳細を入力してください'
const violationNumber = '数字を入力してください'

export const recipeValidationSchema = yup.object().shape({
  name: yup.string().required(requireName),
  time: yup.number().typeError(violationNumber).required(requireTime),
  remarks: yup.string(),
  image: yup.string(),
  ingredients: yup.array(
    yup.object().shape({
      name: yup.string().required(requireIngredientName),
      amount: yup.string().required(requireIngredientAmount),
    })
  ),
  recipeDescriptions: yup.array(
    yup.object().shape({
      order: yup
        .number()
        .typeError(violationNumber)
        .required(requireRecipeDescriptionOrder),
      text: yup.string().required(requireRecipeDescriptionText),
    })
  ),
  tags: yup.array(
    yup.object().shape({
      text: yup.string(),
    })
  ),
})
