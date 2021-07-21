import { useEffect, VFC, ReactElement } from 'react'
import { useRouter } from 'next/router'
import { useAppSelector } from '../../re-ducks/hooks'
import {
  selectUserRole,
  selectAuthLoading,
} from '../../re-ducks/auth/authSlice'

type Props = {
  children: ReactElement
}

const WithAdmin: VFC<Props> = ({ children }) => {
  const router = useRouter()
  const userRole = useAppSelector(selectUserRole)
  const isLoading = useAppSelector(selectAuthLoading)

  useEffect(() => {
    if (!isLoading) return
    if (userRole === 'user') {
      router.replace('/')
    }
    if (userRole === undefined) {
      router.replace('/login')
    }
  }, [isLoading])
  return children
}

export default WithAdmin
