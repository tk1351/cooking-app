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
  Menu,
  MenuItem,
  Grid,
} from '@material-ui/core'
import Link from 'next/link'
import {
  TwitterShareButton,
  TwitterIcon,
  LineShareButton,
  LineIcon,
} from 'react-share'
import { IRecipe } from '../../re-ducks/recipe/type'
import { useAppSelector } from '../../re-ducks/hooks'
import { selectUserRole } from '../../re-ducks/auth/authSlice'
import styles from '../../styles/components/recipe/recipeItem.module.css'

const useStyles = makeStyles({
  media: {
    maxWidth: 345,
    height: 140,
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

  const ShareField = () => {
    const title = recipe.name
    const url = `http://localhost:3000/recipe/${recipe.id}`
    return (
      <>
        <Menu
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorEl={anchorEl}
        >
          <MenuItem>
            <TwitterShareButton title={title} url={url}>
              <TwitterIcon size={32} round={true} />
            </TwitterShareButton>
          </MenuItem>
          <MenuItem>
            <LineShareButton title={title} url={url}>
              <LineIcon size={32} round={true} />
            </LineShareButton>
          </MenuItem>
        </Menu>
      </>
    )
  }

  return (
    <Grid item xs={4}>
      <Card>
        <CardActionArea>
          <CardMedia className={classes.media} image={recipe.image} />
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              component="h2"
              className="font-bold"
            >
              {recipe.name}
            </Typography>
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
          <ShareField />
          <Button size="small" color="primary" variant="contained">
            <Link href={`/recipe/${recipe.id}`}>詳細</Link>
          </Button>
          {userRole === 'admin' ? (
            <>
              <Button size="small" color="primary">
                <Link href={`/recipe/edit/${recipe.id}`}>編集</Link>
              </Button>
              <Button size="small" color="primary" type="button">
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
