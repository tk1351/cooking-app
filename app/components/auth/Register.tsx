import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { unwrapResult } from '@reduxjs/toolkit'
import { RegisterUser } from '../../re-ducks/auth/type'
import { useAppDispatch } from '../../re-ducks/hooks'
import { registerUser } from '../../re-ducks/auth/authSlice'
import { useIsAuthenticated } from '../common/useIsAuthenticated'

const Register = () => {
  useIsAuthenticated()

  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const router = useRouter()

  const { name, email, password, confirmPassword } = formData

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return console.log('パスワードが一致しません')
    }
    const userData: RegisterUser = { name, email, password }
    const resultAction = await dispatch(registerUser(userData))
    if (registerUser.fulfilled.match(resultAction)) {
      unwrapResult(resultAction)

      await router.push('/login')
    }
  }
  return (
    <>
      <h1>ユーザー登録</h1>
      <form onSubmit={(e) => onSubmit(e)}>
        <div>
          <input
            type="text"
            placeholder="ユーザー名"
            name="name"
            value={name}
            onChange={(e) => onChange(e)}
          />
        </div>
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
        <div>
          <input
            type="text"
            placeholder="確認用パスワード"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type="submit" value="登録" />
      </form>
      <p>
        既にアカウントをお持ちの方はこちら
        <Link href="/login">ログイン</Link>
      </p>
    </>
  )
}

export default Register
