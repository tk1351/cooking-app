import React, { useEffect, useState } from 'react'
import { NextPage } from 'next'
import { Grid } from '@material-ui/core'
import axios from 'axios'
import { IUser } from '../../re-ducks/auth/type'
import Spinner from './Spinner'
import Profile from './Profile'
import styles from '../../styles/components/common/authorProfile.module.css'

const AuthorProfile: NextPage = () => {
  const [user, setUser] = useState<IUser>()

  const id = process.env.NODE_ENV === 'production' ? 23 : 1
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
              <Profile user={user} />
            </Grid>
          </Grid>
        </>
      )}
    </>
  )
}

export default AuthorProfile
