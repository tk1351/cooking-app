import { VFC, ReactElement, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAppSelector } from '../../re-ducks/hooks'
import { selectUserId, selectUserRole } from '../../re-ducks/auth/authSlice'

type Props = {
  children: ReactElement
}

const WithUser: VFC<Props> = ({ children }) => {
  const router = useRouter()
  const userId = useAppSelector(selectUserId)
  const userRole = useAppSelector(selectUserRole)

  const params = router.query.userId

  useEffect(() => {
    if (Number(params) !== userId) {
      router.replace('/')
    }
    if (userRole === undefined) {
      router.replace('/login')
    }
  }, [])
  return children
}

export default WithUser
