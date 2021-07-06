import React, { VFC, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { format } from 'date-fns'
import {
  CardMedia,
  Typography,
  Button,
  Menu,
  MenuItem,
  Grid,
  Divider,
  Box,
} from '@material-ui/core'
import { Favorite, FavoriteBorder } from '@material-ui/icons'
import Link from 'next/link'
import { unwrapResult } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import {
  TwitterShareButton,
  TwitterIcon,
  LineShareButton,
  LineIcon,
} from 'react-share'
import { useAppDispatch, useAppSelector } from '../../re-ducks/hooks'
import { likeRecipe, unlikeRecipe } from '../../re-ducks/recipe/recipeSlice'
import { selectUserRole, selectUserId } from '../../re-ducks/auth/authSlice'
import { IRecipe } from '../../re-ducks/recipe/type'
import { setAlert, removeAlert } from '../../re-ducks/alert/alertSlice'
import Alert from '../common/Alert'
import styles from '../../styles/components/recipe/recipe.module.css'
import ShareField from '../common/ShareField'

type Props = {
  recipe: IRecipe
}

const Recipe: VFC<Props> = ({ recipe }) => {
  const dispatch = useAppDispatch()

  const userRole = useAppSelector(selectUserRole)
  const userId = useAppSelector(selectUserId)

  const [isLiked, setIsLiked] = useState(false)
  const [likedNumber, setLikedNumber] = useState(recipe.recipeLikes.length)

  const onLikeRecipeClicked = async (id: number) => {
    const resultAction = await dispatch(likeRecipe(id))
    if (likeRecipe.fulfilled.match(resultAction)) {
      unwrapResult(resultAction)
      setIsLiked((prev) => !prev)

      const alertId = uuidv4()
      dispatch(
        setAlert({
          alertId,
          msg: resultAction.payload.message,
          alertType: 'succeeded',
        })
      )
      setTimeout(() => dispatch(removeAlert({ alertId })), 5000)
      setLikedNumber((prev) => prev + 1)
    }
  }

  const onUnlikeRecipeClicked = async (id: number) => {
    const resultAction = await dispatch(unlikeRecipe(id))
    if (unlikeRecipe.fulfilled.match(resultAction)) {
      unwrapResult(resultAction)

      const alertId = uuidv4()
      dispatch(
        setAlert({
          alertId,
          msg: resultAction.payload.message,
          alertType: 'succeeded',
        })
      )
      setTimeout(() => dispatch(removeAlert({ alertId })), 5000)

      setIsLiked((prev) => !prev)
      setLikedNumber((prev) => prev - 1)
    }
  }

  const likeButton = (
    <Button
      size="small"
      color="primary"
      onClick={() => onLikeRecipeClicked(recipe.id)}
    >
      <FavoriteBorder />
    </Button>
  )

  const unLikeButton = (
    <Button
      size="small"
      color="primary"
      onClick={() => onUnlikeRecipeClicked(recipe.id)}
    >
      <Favorite />
    </Button>
  )

  const ChangeLikedState = () => {
    if (isLiked === false) {
      return likeButton
    } else {
      return unLikeButton
    }
  }

  useEffect(() => {
    // userのuserIdがレシピのお気に入りにあるか判定
    if (
      userRole === 'user' &&
      recipe.recipeLikes.some((elm) => elm.userId === userId)
    ) {
      setIsLiked(true)
    }
  }, [])

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const handleClick = (e: {
    currentTarget: React.SetStateAction<HTMLElement | null>
  }) => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  // const ShareField = () => {
  //   const title = recipe.name
  //   const url = `http://localhost:3000/recipe/${recipe.id}`
  //   return (
  //     <>
  //       <Menu
  //         keepMounted
  //         open={Boolean(anchorEl)}
  //         onClose={handleClose}
  //         anchorEl={anchorEl}
  //       >
  //         <div className={styles.share}>
  //           <MenuItem>
  //             <TwitterShareButton title={title} url={url}>
  //               <TwitterIcon size={32} round={true} />
  //             </TwitterShareButton>
  //           </MenuItem>
  //           <MenuItem>
  //             <LineShareButton title={title} url={url}>
  //               <LineIcon size={32} round={true} />
  //             </LineShareButton>
  //           </MenuItem>
  //         </div>
  //       </Menu>
  //     </>
  //   )
  // }

  // 調理工程のorderで昇順
  const sortDescriptions = recipe.recipeDescriptions.sort((a, b) => {
    return a.order - b.order
  })

  return (
    <Grid container className={styles.recipeWrapper}>
      <Grid item xs={12}>
        <Grid container className={styles.recipeName}>
          <Typography gutterBottom variant="h4" component="h2">
            <Box fontWeight="fontWeightBold">{recipe.name}</Box>
          </Typography>
        </Grid>
        <Grid container>
          <ul className={styles.tag}>
            {recipe.tags.map((tag) => (
              <div key={tag.id}>
                <Link href={{ pathname: '/tag', query: { name: tag.name } }}>
                  <Typography
                    variant="body2"
                    color="primary"
                    component="p"
                    className={styles.linkText}
                  >
                    #{tag.name}
                  </Typography>
                </Link>
              </div>
            ))}
          </ul>
        </Grid>
        <Grid container>
          <Typography variant="body2" color="textSecondary" component="p">
            {format(new Date(recipe.createdAt), 'yyyy-MM-dd')}
          </Typography>
        </Grid>
        <Grid container className={styles.image}>
          <CardMedia
            className={styles.media}
            image={recipe.image}
            component="img"
          />
        </Grid>
        <Grid container>
          <Typography gutterBottom variant="h6" component="h2">
            調理時間： {recipe.time}分
          </Typography>
        </Grid>
        <Grid container>
          <Grid item className={styles.divider}>
            <Divider />
          </Grid>
        </Grid>
        <Grid container className={styles.recipeElement}>
          <Typography gutterBottom variant="h6" component="h2">
            材料
          </Typography>
        </Grid>
        <Grid container className={styles.recipeChildElment}>
          <ul className={styles.ingredients}>
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient.id}>
                <Typography variant="body2" color="textPrimary" component="p">
                  {ingredient.name}： {ingredient.amount}
                </Typography>
              </li>
            ))}
          </ul>
        </Grid>
        <Grid container>
          <Grid item className={styles.divider}>
            <Divider />
          </Grid>
        </Grid>
        <Grid container className={styles.recipeElement}>
          <Typography gutterBottom variant="h6" component="h2">
            調理工程
          </Typography>
        </Grid>
        <Grid container className={styles.recipeChildElment}>
          <ul>
            {sortDescriptions.map((recipeDescription) => (
              <div key={recipeDescription.id}>
                <Typography variant="body2" color="textPrimary" component="p">
                  {recipeDescription.order}： {recipeDescription.text}
                </Typography>
                {recipeDescription.url && (
                  <a
                    href={recipeDescription.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Typography
                      variant="body2"
                      color="primary"
                      component="p"
                      className={styles.a}
                    >
                      参考：{recipeDescription.url}
                    </Typography>
                  </a>
                )}
              </div>
            ))}
          </ul>
        </Grid>
        <Grid container>
          {recipe.remarks && (
            <Grid item className={styles.divider}>
              <Divider />
            </Grid>
          )}
        </Grid>
        <Grid container className={styles.recipeElement}>
          {recipe.remarks && (
            <Typography gutterBottom variant="h6" component="h2">
              補足
            </Typography>
          )}
        </Grid>
        <Grid container>
          {recipe.remarks && (
            <Typography variant="body2" color="textPrimary" component="p">
              {recipe.remarks}
            </Typography>
          )}
        </Grid>
        <Grid container>
          <div className={styles.buttonWrapper}>
            <div className={styles.button}>
              <Button
                size="small"
                color="primary"
                variant="contained"
                onClick={handleClick}
              >
                Share
              </Button>
            </div>
            <ShareField
              recipe={recipe}
              anchorEl={anchorEl}
              handleClose={handleClose}
            />
            {userRole === 'admin' && (
              <>
                <div className={styles.button}>
                  <Button size="small" color="primary" variant="contained">
                    <Link href={`/recipe/edit/${recipe.id}`}>編集</Link>
                  </Button>
                </div>
                <Button
                  size="small"
                  color="secondary"
                  variant="contained"
                  type="button"
                >
                  <Link href={`/admin/recipe/${recipe.id}`}>削除</Link>
                </Button>
              </>
            )}
            {userRole === 'user' && (
              <>
                <ChangeLikedState />
                {likedNumber >= 1 && likedNumber}
                <Alert />
              </>
            )}
            {userRole === undefined && (
              <>
                <FavoriteBorder />
                {likedNumber >= 1 && likedNumber}
              </>
            )}
          </div>
        </Grid>
        <Grid container className={styles.backHomeWrapper}>
          <Link href="/">
            <p className={styles.backHome}>一覧へ戻る</p>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Recipe
