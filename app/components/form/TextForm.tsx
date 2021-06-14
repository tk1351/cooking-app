import React, { VFC } from 'react'
import { TextField } from '@material-ui/core'
import { RefCallBack } from 'react-hook-form'

interface ITextFormProps {
  head: string
  id: string
  label: string
  placeholder: string
  type: string
  name: string
  value?: number
  variant: 'filled' | 'outlined' | 'standard'
  onChange: (...event: any[]) => void
  inputRef?: RefCallBack
  error: boolean
  helperText: string | undefined
  defaultValue?: any
}

const TextForm: VFC<ITextFormProps> = (props) => {
  return (
    <div>
      <div>
        <span>{props.head}</span>
      </div>
      <TextField
        id={props.id}
        label={props.label}
        placeholder={props.placeholder}
        type={props.type}
        name={props.name}
        value={props.value}
        variant={props.variant}
        onChange={props.onChange}
        inputRef={props.inputRef}
        error={props.error}
        helperText={props.helperText}
        defaultValue={props.defaultValue}
      />
    </div>
  )
}

export default TextForm
