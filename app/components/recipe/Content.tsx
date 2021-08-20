import React from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import {
  Typography,
  Button,
  Grid,
  Box,
  CardMedia,
  Divider,
} from '@material-ui/core'
import { Favorite, FavoriteBorder, YouTube } from '@material-ui/icons'
import { utcToZonedTime } from 'date-fns-tz'
import { format } from 'date-fns'
import { IRecipe } from '../../re-ducks/recipe/type'
import styles from '../../styles/components/recipe/content.module.css'

type Props = {
  recipe: IRecipe
}

const Content: NextPage<Props> = ({ recipe }) => {
  // 調理工程のorderで昇順
  const sortDescriptions = recipe.recipeDescriptions.sort((a, b) => {
    return a.order - b.order
  })

  const date = new Date(recipe.createdAt)
  const jstDate = utcToZonedTime(date, 'Asia/Tokyo')
  return (
    <>
      <Grid container className={styles.recipeName}>
        <Typography gutterBottom variant="h4" component="h2">
          <Box fontWeight="fontWeightBold">{recipe.name}</Box>
        </Typography>
      </Grid>
      <Grid container>
        <a
          href={recipe.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.url}
        >
          <YouTube fontSize="large" />
        </a>
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
          {format(jstDate, 'yyyy-MM-dd')}
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
    </>
  )
}

export default Content
