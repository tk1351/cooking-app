import React, { VFC } from 'react'
import { Button } from '@material-ui/core'

interface IFormButtonProps {
  variant: 'contained' | 'outlined' | 'text'
  color: 'default' | 'inherit' | 'primary' | 'secondary'
  label: string
  type: 'button' | 'submit' | 'reset' | undefined
}

const FormButton: VFC<IFormButtonProps> = (props) => {
  return (
    <Button variant={props.variant} color={props.color} type={props.type}>
      {props.label}
    </Button>
  )
}

export default FormButton
