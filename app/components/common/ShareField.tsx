import React, { VFC } from 'react'
import { Menu, MenuItem } from '@material-ui/core'
import {
  TwitterShareButton,
  TwitterIcon,
  LineShareButton,
  LineIcon,
} from 'react-share'
import { IRecipe } from '../../re-ducks/recipe/type'
import styles from '../../styles/components/common/shareField.module.css'

type Props = {
  recipe: IRecipe
  anchorEl: HTMLElement | null
  handleClose: () => void
}

const ShareField: VFC<Props> = ({ recipe, anchorEl, handleClose }) => {
  const title = recipe.name
  const url = `${process.env.NEXT_PUBLIC_APP_URL}recipe/${recipe.id}`

  return (
    <Menu
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
      anchorEl={anchorEl}
    >
      <div className={styles.menuItem}>
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
      </div>
    </Menu>
  )
}

export default ShareField
