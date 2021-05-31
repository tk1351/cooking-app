import { useRouter } from 'next/router'
import { useAppSelector } from '../../re-ducks/hooks'
import { selectUserRole } from '../../re-ducks/auth/authSlice'
import { useEffect } from 'react'

export const useIsAdmin = () => {
  const userRole = useAppSelector(selectUserRole)
  const router = useRouter()

  useEffect(() => {
    if (userRole !== 'admin') {
      router.push('/login')
    }
  }, [])
}
