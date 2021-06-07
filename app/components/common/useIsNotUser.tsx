import { useRouter } from 'next/router'
import {
  selectIsAuthenticated,
  selectUserRole,
} from '../../re-ducks/auth/authSlice'
import { useAppSelector } from '../../re-ducks/hooks'

// authStateのisAuthenticatedがfalse、またはroleが!userの場合は、index.tsxへリダイレクト
export const useIsNotUser = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const userRole = useAppSelector(selectUserRole)
  const router = useRouter()

  if (!isAuthenticated || userRole !== 'user') {
    router.push('/')
  }
}
