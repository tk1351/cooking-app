import React, { VFC } from 'react'
import { Grid, Typography, Avatar } from '@material-ui/core'
import { YouTube, Twitter, Facebook, Instagram } from '@material-ui/icons'
import { IUser } from '../../re-ducks/auth/type'
import styles from '../../styles/components/common/authorProfile.module.css'
import SocialLinks from './SocialLinks'

type Props = {
  user: IUser
}

const AuthorProfile: VFC<Props> = ({ user }) => {
  return (
    <Grid container className={styles.wrapper}>
      <Grid item xs={12}>
        <Grid container justify="center">
          <h1 className={styles.h1}>小坊主プロフィール</h1>
        </Grid>
        <Grid container justify="center" className={styles.avatar}>
          <Avatar
            src={user.picture}
            style={{ height: '5rem', width: '5rem' }}
          />
        </Grid>
        <SocialLinks socials={user.socials} />
        <Grid container>
          <Typography gutterBottom variant="h5" component="h2">
            好きな食べ物:{user.favoriteDish}
          </Typography>
        </Grid>
        <Grid container>
          <Typography gutterBottom variant="h5" component="h2">
            得意料理:{user.specialDish}
          </Typography>
        </Grid>
        <Grid container>
          <Typography gutterBottom variant="h5" component="h2">
            自己紹介:{user.bio}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default AuthorProfile
