import { useRouter } from 'next/router'
import { selectIsAuthenticated } from '../../re-ducks/auth/authSlice'
import { useAppSelector } from '../../re-ducks/hooks'

// authStateのisAuthenticatedがtrueの場合はindex.tsxへリダイレクトする
export const useIsAuthenticated = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const router = useRouter()

  if (isAuthenticated) {
    router.push('/')
  }
}
