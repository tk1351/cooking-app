import React, { VFC, useState } from 'react'
import { format } from 'date-fns'
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  makeStyles,
  Grid,
} from '@material-ui/core'
import Link from 'next/link'
import { IRecipe } from '../../re-ducks/recipe/type'
import { useAppSelector } from '../../re-ducks/hooks'
import { selectUserRole } from '../../re-ducks/auth/authSlice'
import styles from '../../styles/components/recipe/recipeItem.module.css'
import ShareField from '../common/ShareField'

const useStyles = makeStyles({
  media: {
    maxWidth: 345,
    height: 140,
    '&:hover': {
      opacity: 0.7,
    },
  },
})

type Props = {
  recipe: IRecipe
}

const RecipeItem: VFC<Props> = ({ recipe }) => {
  const classes = useStyles()

  const userRole = useAppSelector(selectUserRole)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const handleClick = (e: {
    currentTarget: React.SetStateAction<HTMLElement | null>
  }) => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Grid item xs={4}>
      <Card>
        <CardActionArea>
          <Link href={`/recipe/${recipe.id}`}>
            <CardMedia className={classes.media} image={recipe.image} />
          </Link>
          <CardContent>
            <Link href={`/recipe/${recipe.id}`}>
              <Typography
                gutterBottom
                variant="h6"
                component="h2"
                className={styles.linkText}
              >
                {recipe.name}
              </Typography>
            </Link>
            <Typography variant="body2" color="textSecondary" component="p">
              {format(new Date(recipe.createdAt), 'yyyy-MM-dd')}
            </Typography>
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
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={handleClick}
          >
            Share
          </Button>
          <ShareField
            recipe={recipe}
            anchorEl={anchorEl}
            handleClose={handleClose}
          />
          <Button size="small" color="primary" variant="contained">
            <Link href={`/recipe/${recipe.id}`}>詳細</Link>
          </Button>
          {userRole === 'admin' ? (
            <>
              <Button
                size="small"
                color="primary"
                variant="contained"
                type="button"
              >
                <Link href={`/recipe/edit/${recipe.id}`}>編集</Link>
              </Button>
              <Button
                size="small"
                color="secondary"
                variant="contained"
                type="button"
              >
                <Link href={`/admin/recipe/${recipe.id}`}>削除</Link>
              </Button>
            </>
          ) : (
            <></>
          )}
        </CardActions>
      </Card>
    </Grid>
  )
}

export default RecipeItem
