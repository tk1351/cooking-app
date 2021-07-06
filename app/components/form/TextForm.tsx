import React, { VFC } from 'react'
import { TextField, Typography } from '@material-ui/core'
import { RefCallBack } from 'react-hook-form'

export interface ITextFormProps {
  id: string
  label: string
  type: string
  name: string
  value?: number
  variant: 'filled' | 'outlined' | 'standard'
  onChange: (...event: any[]) => void
  inputRef?: RefCallBack
  error: boolean
  helperText: string | undefined
  defaultValue?: any
  className?: string
  fullWidth?: boolean
  multiline?: boolean
  rows?: number
}

const TextForm: VFC<ITextFormProps> = (props) => {
  return (
    <div>
      <TextField
        id={props.id}
        label={props.label}
        type={props.type}
        name={props.name}
        value={props.value}
        variant={props.variant}
        onChange={props.onChange}
        inputRef={props.inputRef}
        error={props.error}
        helperText={props.helperText}
        defaultValue={props.defaultValue}
        fullWidth={props.fullWidth}
        className={props.className}
        multiline={props.multiline}
        rows={props.rows}
      />
    </div>
  )
}

export default TextForm
