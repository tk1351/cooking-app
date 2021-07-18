import axios from 'axios'

export default axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_AUTH0_API_URL
      : 'http://localhost:8080',
})
