import axios from 'axios'

const { URI } = process.env

export const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
})
