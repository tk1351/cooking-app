import React, { useState } from 'react'
import Link from 'next/link'
import { unwrapResult } from '@reduxjs/toolkit'
import { LoginUser } from '../../re-ducks/auth/type'
import { useAppDispatch } from '../../re-ducks/hooks'
import { loginUser } from '../../re-ducks/auth/authSlice'

const Login = () => {
  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const userData: LoginUser = { email, password }
    const resultAction = await dispatch(loginUser(userData))
    if (loginUser.fulfilled.match(resultAction)) {
      unwrapResult(resultAction)
    }
  }
  return (
    <>
      <h1>ログイン</h1>
      <form onSubmit={(e) => onSubmit(e)}>
        <div>
          <input
            type="text"
            placeholder="メールアドレス"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="パスワード"
            name="password"
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type="submit" value="登録" />
      </form>
      <p>
        ユーザー登録がお済みでない方はこちら
        <Link href="/register">ユーザー登録</Link>
      </p>
    </>
  )
}

export default Login
