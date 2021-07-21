import React, { VFC } from 'react'
import Link from 'next/link'
import { Divider, IconButton } from '@material-ui/core'
import { useAuth0 } from '@auth0/auth0-react'
import { useAppSelector } from '../../re-ducks/hooks'
import { selectUserRole, selectUserId } from '../../re-ducks/auth/authSlice'
import styles from '../../styles/components/common/footer.module.css'

const Footer: VFC = () => {
  const { isAuthenticated, isLoading } = useAuth0()
  const userRole = useAppSelector(selectUserRole)
  const userId = useAppSelector(selectUserId)

  const youtubeUrl = 'https://www.youtube.com/channel/UCtDNl_jdDLiCm1XyiiYc_aQ'

  const guestFotter = (
    <div className={styles.wrapper}>
      <div className={styles.linkText}>
        <Link href="/profile">小坊主について</Link>
      </div>
      <div className={styles.linkText}>
        <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
          Youtubeチャンネル
        </a>
      </div>
    </div>
  )

  const userFotter = (
    <div className={styles.wrapper}>
      <div className={styles.linkText}>
        <Link href="/profile">小坊主について</Link>
      </div>
      <div className={styles.linkText}>
        <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
          Youtubeチャンネル
        </a>
      </div>
      <div className={styles.linkText}>
        <Link href="/contact">お問い合わせ</Link>
      </div>
    </div>
  )

  const adminFooter = (
    <div className={styles.linkText}>
      <Link href={`/admin/${userId}`}>管理者ページ</Link>
    </div>
  )

  const Footers = () => {
    if (isAuthenticated && userRole === 'user') {
      return userFotter
    } else if (isAuthenticated && userRole === 'admin') {
      return adminFooter
    } else {
      return guestFotter
    }
  }

  return (
    <div className={styles.footer}>
      <IconButton edge="start" color="inherit" aria-label="open drawer">
        <Link href="/">
          <p>Cooking-app</p>
        </Link>
      </IconButton>
      {!isLoading && <Footers />}
    </div>
  )
}

export default Footer
