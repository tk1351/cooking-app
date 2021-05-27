import React, { useState } from 'react'
import Link from 'next/link'

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })

  const { email, password, confirmPassword } = formData

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return console.log('パスワードが一致しません')
    }
    return console.log('formData', formData)
  }
  return (
    <>
      <h1>ユーザー登録</h1>
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
