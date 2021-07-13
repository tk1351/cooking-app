import { useEffect, VFC, ReactElement } from 'react'
import { useRouter } from 'next/router'
import { useAppSelector } from '../../re-ducks/hooks'
import { selectUserRole } from '../../re-ducks/auth/authSlice'

type Props = {
  children: ReactElement
}

const WithAdmin: VFC<Props> = ({ children }) => {
  const router = useRouter()
  const userRole = useAppSelector(selectUserRole)

  useEffect(() => {
    if (userRole === 'user') {
      router.replace('/')
    }
    if (userRole === undefined) {
      router.replace('/login')
    }
  }, [])
  return children
}

export default WithAdmin
