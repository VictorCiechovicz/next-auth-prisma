import AuthButton from '@/components/ui/auth-button'
import { getCurrentUser } from '@/lib/session'
import { redirect } from 'next/navigation'


export default async function Home() {

  const session = await getCurrentUser()
  if (!session) redirect('signin?callbackUrl=/server')


  return (
    <div className="m-12">
      <p>Home</p>
      <AuthButton page='home' />
    </div>
  )
}
