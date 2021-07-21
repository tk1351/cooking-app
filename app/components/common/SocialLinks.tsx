import React, { VFC } from 'react'
import { Grid } from '@material-ui/core'
import { YouTube, Twitter, Facebook, Instagram } from '@material-ui/icons'
import { ISocial } from '../../re-ducks/defaultType'
import styles from '../../styles/components/common/socialLinks.module.css'

type Props = {
  socials: ISocial[]
}

const SocialLinks: VFC<Props> = ({ socials }) => {
  const snsIcon = (category: number) => {
    switch (category) {
      case 1:
        return <YouTube className={styles.icon} fontSize="large" />
      case 2:
        return <Twitter className={styles.icon} fontSize="large" />
      case 3:
        return <Instagram className={styles.icon} fontSize="large" />
      case 4:
        return <Facebook className={styles.icon} fontSize="large" />
      default:
        return <YouTube className={styles.icon} fontSize="large" />
    }
  }

  // categoryを昇順
  const orderdSocials = socials.sort((a, b) => a.category - b.category)

  return (
    <Grid container justify="center" className={styles.icons}>
      {orderdSocials.map((social) => (
        <a
          key={social.id}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {snsIcon(social.category)}
        </a>
      ))}
    </Grid>
  )
}

export default SocialLinks
