import React, { VFC } from 'react'
import { Button } from '@material-ui/core'

export interface IFormButtonProps {
  variant: 'contained' | 'outlined' | 'text'
  color: 'default' | 'inherit' | 'primary' | 'secondary'
  label: string
  type: 'button' | 'submit' | 'reset' | undefined
  className?: string
}

const FormButton: VFC<IFormButtonProps> = (props) => {
  return (
    <Button
      variant={props.variant}
      color={props.color}
      type={props.type}
      fullWidth
      className={props.className}
    >
      {props.label}
    </Button>
  )
}

export default FormButton
