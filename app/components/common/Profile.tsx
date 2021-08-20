import React from 'react'
import { NextPage } from 'next'
import { Grid, Typography, Avatar } from '@material-ui/core'
import { IUser } from '../../re-ducks/auth/type'
import SocialLinks from './SocialLinks'
import styles from '../../styles/components/common/profile.module.css'

type Props = {
  user: IUser
}

const Profile: NextPage<Props> = ({ user }) => {
  return (
    <>
      <Grid container justify="center" className={styles.avatar}>
        <Avatar src={user.picture} style={{ height: '5rem', width: '5rem' }} />
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
    </>
  )
}

export default Profile
