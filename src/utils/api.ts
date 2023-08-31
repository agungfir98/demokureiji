import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

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

export interface APIReturnType<T> {
  result: T
}

export const apiGet = async <T>(
  path: string,
  accessToken?: string,
): Promise<AxiosResponse<T>> => {
  return api.get(path, headers(accessToken))
}

export const apiPost = async <T, P = object>(
  path: string,
  payload?: P,
  accessToken?: string,
): Promise<AxiosResponse<T>> => {
  return api.post<AxiosRequestConfig<P>, AxiosResponse<T>>(
    path,
    payload,
    headers(accessToken),
  )
}

export const apiPut = async <T, P = object>(
  path: string,
  payload?: P,
  accessToken?: string,
): Promise<AxiosResponse<T>> => {
  return api.put<AxiosRequestConfig<P>, AxiosResponse<T>>(
    path,
    payload,
    headers(accessToken),
  )
}

export const apiDelete = async <T>(
  path: string,
  accessToken?: string,
): Promise<AxiosResponse<T>> => {
  return api.delete<any, AxiosResponse<T>>(path, headers(accessToken))
}
