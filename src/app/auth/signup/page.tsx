'use client'
import Button from '@/components/Button'
import { api } from '@/utils/api'
import { useMutation } from '@tanstack/react-query'
import { Form, Input } from 'antd'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

type FieldType = {
  email: string
  name: string
  password: string
  confirmPassword: string
}

const SignUp = () => {
  const route = useRouter()

  const mutation = useMutation({
    mutationFn: (data: FieldType) => api.post('/register_user', data),
    onSuccess() {
      toast.success('Berhasil membuat akun')
    },
    onError(err: Error | AxiosError) {
      if (axios.isAxiosError<{ form: string; msg: string }>(err)) {
        if (err.response) {
          const { data, status } = err.response
          toast.error(`error ${status} ${data.msg} `)
        }
      }
    },
  })

  const onSubmitLoginForm = (values: FieldType) => {
    mutation.mutate(values)
  }

  return (
    <div className="rounded-xl overflow-hidden flex w-5/6">
      <div className="bg-white w-full p-5 flex flex-col gap-2">
        <h1 className="text-center font-bold text-xl">Sign In</h1>
        <Form onFinish={onSubmitLoginForm} layout="vertical">
          <Form.Item<FieldType>
            label="email"
            name="email"
            rules={[
              { required: true, message: 'please input your email!' },
              { type: 'email', message: 'please input valid email' },
            ]}
          >
            <Input placeholder="example@mail.domain" />
          </Form.Item>
          <Form.Item<FieldType>
            label="name"
            name="name"
            rules={[{ required: true, message: 'please input your email!' }]}
          >
            <Input placeholder="your name" />
          </Form.Item>
          <Form.Item<FieldType>
            label="password"
            name="password"
            rules={[{ required: true, message: 'please input password' }]}
          >
            <Input.Password placeholder="******" />
          </Form.Item>
          <Form.Item<FieldType>
            label="confirm password"
            name="confirmPassword"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'please input password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(
                    new Error("Confirm password didn't match")
                  )
                },
              }),
            ]}
          >
            <Input.Password placeholder="******" />
          </Form.Item>
          <div className="flex justify-end w-full">
            <Button
              className="self-end"
              variant="primary"
              shape="round"
              size="md"
              loading={mutation.isLoading}
            >
              Sign Up
            </Button>
          </div>
        </Form>
      </div>
      <div className="bg-blue-600 text-white w-full p-5 flex flex-col justify-center items-center gap-3">
        <p>Already have an account?</p>
        <Button
          shape="round"
          size="md"
          variant="primary"
          onClick={() => route.push('/auth/signin')}
        >
          Sign In
        </Button>
      </div>
    </div>
  )
}

export default SignUp
