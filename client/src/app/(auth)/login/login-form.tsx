'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema'
import { useToast } from '@/components/ui/use-toast'
import authApiRequest from '@/apiRequests/auth'
import { useRouter } from 'next/navigation'

const LoginForm = () => {
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  // 2. Define a submit handler.
  async function onSubmit(values: LoginBodyType) {
    try {
      const result = await authApiRequest.login(values)
      toast({
        description: result.payload.message
      })
      await authApiRequest.auth({ sessionToken: result.payload.data.token })
      router.push('/me')
    } catch (error: any) {
      const errors = error.payload.errors as {
        field: string
        message: string
      }[]
      const status = error.status as number
      if (status === 422) {
        errors.forEach((error) => {
          form.setError(error.field as 'email' | 'password', {
            type: 'server',
            message: error.message
          })
        })
      } else {
        toast({
          title: 'Lỗi',
          description: error.payload.message,
          variant: 'destructive'
        })
      }
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-2 max-w-[600px] flex-shrink-0 w-full'
        noValidate
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='shadcn' type='email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input placeholder='shadcn' type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='!mt-8 w-full'>
          Đăng nhập
        </Button>
      </form>
    </Form>
  )
}

export default LoginForm
