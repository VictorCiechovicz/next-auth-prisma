'use client'

import React, { useState } from 'react'

import { cn } from '@/lib/utils'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { signIn } from 'next-auth/react'
import { useToast } from './use-toast'
import { ToastAction } from './toast'
import { useRouter } from 'next/navigation'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

interface IUser {
  email: string
  password: string
}

export function SignInForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<IUser>({
    email: '',
    password: ''
  })

  const router = useRouter()
  const { toast } = useToast()

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    const response = await signIn<'credentials'>('credentials', {
      ...data,
      redirect: false
    })



    if (response?.error) {
      toast({
        title: 'Oops...',
        description: response?.error,
        variant: 'destructive',
        action: (
          <ToastAction altText="Tente Novamente">Tente Novamente</ToastAction>
        )
      })
    } else {
      router.push('/')
    }

    setData({
      email: '',
      password: ''
    })
    setIsLoading(false)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData(prev => {
      return { ...prev, [event.target.name]: event.target.value }
    })
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              disabled={isLoading}
              name="email"
              value={data.email}
              onChange={handleChange}
            />
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="password"
              type="password"
              autoCapitalize="none"
               disabled={isLoading}
              name="password"
              value={data.password}
              onChange={handleChange}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{' '}
        Github
      </Button>
    </div>
  )
}
