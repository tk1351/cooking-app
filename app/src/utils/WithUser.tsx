import { VFC, ReactElement, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAppSelector } from '../../re-ducks/hooks'
import {
  selectUserId,
  selectUserRole,
  selectAuthLoading,
} from '../../re-ducks/auth/authSlice'

type Props = {
  children: ReactElement
}

const WithUser: VFC<Props> = ({ children }) => {
  const router = useRouter()
  const userId = useAppSelector(selectUserId)
  const userRole = useAppSelector(selectUserRole)
  const isLoading = useAppSelector(selectAuthLoading)

  const params = router.query.userId

  useEffect(() => {
    if (!isLoading) return
    if (Number(params) !== userId) {
      router.replace('/')
    }
    if (userRole === undefined) {
      router.replace('/login')
    }
  }, [isLoading])
  return children
}

export default WithUser
