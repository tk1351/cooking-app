import React, { useState } from 'react'
import Link from 'next/link'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    return console.log('formData', formData)
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
