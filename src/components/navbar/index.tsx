'use client'
import Button from '../Button'
import {
  LoginOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
import { api } from '@/utils/api'
import { useNavSlice } from '@/slice/globalslice'
import Link from 'next/link'
import { Dropdown, MenuProps, Modal } from 'antd'
import { useRouter } from 'next/navigation'

interface NavbarProp {
  userId: string
  userName: string
}

const Navbar: React.FC<NavbarProp> = ({ userId, userName }) => {
  const router = useRouter()
  const { toggleNavCollapsed, navCollapsed } = useNavSlice((state) => state)
  const [showModal, setShowModal] = useState<boolean>(false)

  const items: MenuProps['items'] = [
    {
      key: '1',
      danger: true,
      label: (
        <Button variant={'link'} onClick={() => setShowModal(true)}>
          Logout
        </Button>
      ),
      itemIcon: <LoginOutlined />,
    },
  ]

  const handleLogout = () => {
    api.post('/logout').then(() => {
      router.push('/auth/signin')
    })
  }

  return (
    <>
      <Modal
        title="Logout"
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={handleLogout}
      >
        <h1>Loging out, are you sure?</h1>
      </Modal>
      <nav className="h-12 w-screen flex justify-between px-10 items-center bg-white">
        <Button
          variant="link"
          size="md"
          shape="round"
          onClick={() => toggleNavCollapsed(navCollapsed)}
        >
          {navCollapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        </Button>
        <ul>
          <li>
            <Dropdown.Button
              menu={{ items }}
              icon={<UserOutlined />}
              placement="bottomRight"
            >
              <div className="flex gap-2 items-center">
                <Link href={`/user/${userId}`}>{userName}</Link>
              </div>
            </Dropdown.Button>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default Navbar
