import React, { VFC } from 'react'
import { useRouter } from 'next/router'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import SearchIcon from '@material-ui/icons/Search'
import { InputBase, Button } from '@material-ui/core'
import { IQuery } from '../../re-ducks/recipe/type'
import styles from '../../styles/components/form/searchForm.module.css'

const defaultValues: IQuery = {
  query: '',
}

const SearchForm: VFC = () => {
  const router = useRouter()

  const { control, handleSubmit } = useForm<IQuery>({
    defaultValues,
  })

  const onSubmit: SubmitHandler<IQuery> = async ({ query }) => {
    if (!query) {
      return console.log('ng')
    }

    router.push({
      pathname: '/search',
      query: { query },
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.searchFormWrapper}>
          <SearchIcon />
          <Controller
            name="query"
            control={control}
            render={({ field: { onChange, ref } }) => (
              <InputBase
                inputProps={{ 'data-testid': 'query' }}
                placeholder="レシピを検索する"
                onChange={onChange}
                inputRef={ref}
                className={styles.inputRoot}
              />
            )}
          />
        </div>
        <Button color="primary" type="submit" variant="contained">
          検索
        </Button>
      </form>
    </div>
  )
}

export default SearchForm
