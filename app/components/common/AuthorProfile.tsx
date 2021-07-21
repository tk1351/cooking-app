import React, { VFC, useEffect, useState } from 'react'
import { Grid, Typography, Avatar } from '@material-ui/core'
import axios from 'axios'
import { IUser } from '../../re-ducks/auth/type'
import SocialLinks from './SocialLinks'
import Spinner from './Spinner'
import styles from '../../styles/components/common/authorProfile.module.css'

const AuthorProfile: VFC = () => {
  const [user, setUser] = useState<IUser>()

  const id = 1
  const url = `${process.env.NEXT_PUBLIC_API_URL}/users/author/${id}`
  useEffect(() => {
    ;(async () => {
      const res = await axios.get<IUser>(url)
      setUser(res.data)
    })()
  }, [])
  return (
    <>
      {user === undefined ? (
        <Spinner />
      ) : (
        <>
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
        </>
      )}
    </>
  )
}

export default AuthorProfile
