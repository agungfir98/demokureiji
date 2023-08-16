import axios, { AxiosResponse } from 'axios'

const URI = process.env.NEXT_PUBLIC_URI

export const api = axios.create({
  baseURL: URI,
  withCredentials: true,
})

const headers = (token?: string) => ({
  headers: {
    'auth-token': token ? `Bearer ${token}` : '',
  },
})

export const apiGet = async <T>(
  path: string,
  accessToken?: string,
): Promise<AxiosResponse<{ result: T }>> => {
  return api.get(path, headers(accessToken))
}

export const apiPost = async <T>(
  path: string,
  accessToken?: string,
): Promise<AxiosResponse<T>> => {
  return api.post(path, headers(accessToken))
}
