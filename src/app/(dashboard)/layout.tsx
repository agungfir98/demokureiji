'use client'
import LoadingScreen from '@/components/loadingScreen'
import Navbar from '@/components/navbar'
import { apiGet, apiPost } from '@/utils/api'
import { useQuery } from '@tanstack/react-query'
import { HomeTwoTone, TeamOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'
import { useNavSlice } from '@/slice/globalslice'
import { useTokenSlice } from '@/slice/tokenStore'
import Link from 'next/link'
import { UserType } from '@/types/user-type'

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
) {
  return { key, icon, label, children, type } as MenuItem
}

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter()
  const { setAccessToken, accessToken } = useTokenSlice((state) => state)
  const navCollapsed = useNavSlice((state) => state.navCollapsed)

  const { isLoading } = useQuery({
    queryKey: ['access-token'],
    queryFn: () =>
      apiPost<{ token: string }>('/refresh_token').then((res) => res.data),
    onSuccess(data) {
      const { token } = data
      setAccessToken(token)
    },
    onError() {
      router.push('/auth/signin')
    },
    refetchOnWindowFocus: false,
    refetchInterval: 540000,
    retry(_, error: AxiosError) {
      return error.response?.status !== 401
    },
  })

  const { data: userData } = useQuery({
    queryKey: ['user', accessToken],
    queryFn: () =>
      apiGet<UserType>('/user', accessToken).then((res) => res.data),
    enabled: !!accessToken,
    refetchOnWindowFocus: false,
  })

  const items: MenuItem[] = [
    getItem(<Link href={`/`}>Home</Link>, '1', <HomeTwoTone />),
    getItem(
      <Link href={`/org`}>Organization</Link>,
      '2',
      <Link href={`/org`}>
        <TeamOutlined />
      </Link>,
      userData?.result.organization.map((v, i) =>
        getItem(
          <Link href={`/org/${v._id}`}>{v.organization}</Link>,
          `2${i + 1}`,
        ),
      ),
    ),
  ]

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!!accessToken) {
    return (
      <div className="bg-[#ededed] min-h-screen max-h-screen overflow-hidden flex flex-col">
        <Navbar
          userId={userData?.result._id as string}
          userName={userData?.result.name as string}
        />
        <div className="flex gap-5 flex-auto">
          <Menu
            mode="inline"
            inlineCollapsed={navCollapsed}
            items={items}
            className="w-fit h-full"
          />
          <div className="h-[86vh] overflow-hidden bg-white w-full mt-5 mr-5 px-5 py-7 rounded-2xl">
            {children}
          </div>
        </div>
      </div>
    )
  }
}

export default Layout
