'use client'
import { Button, buttonVariants } from '@/components/ui/button'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function AuthButton({ page }: { page: string }) {
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'
  return (
    <>
      {!isAuthenticated ? (
        <Link
          href={page === 'signup' ? '/signin' : 'signup'}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'absolute right-4 top-4 md:right-8 md:top-8'
          )}
        >
          {page === 'signup' ? 'Sign In' : 'Sign Up'}
        </Link>
      ) : (
        <Button
          onClick={() => signOut({ callbackUrl: '/' })}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'absolute right-4 top-4 md:right-8 md:top-8'
          )}
        >
          Sign Out
        </Button>
      )}
    </>
  )
}
