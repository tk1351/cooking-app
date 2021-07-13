import { VFC, ReactElement, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAppSelector } from '../../re-ducks/hooks'
import { selectUserRole } from '../../re-ducks/auth/authSlice'

type Props = {
  children: ReactElement
}

const WithGuest: VFC<Props> = ({ children }) => {
  const router = useRouter()
  const userRole = useAppSelector(selectUserRole)

  console.log('role', userRole)

  useEffect(() => {
    if (userRole === 'user' || userRole === 'admin') {
      router.replace('/')
    }
  }, [userRole])
  return children
}

export default WithGuest
