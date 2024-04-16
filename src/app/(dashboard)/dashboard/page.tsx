import { FC } from 'react'
import Button from '@/components/ui/button'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'


const page = async ({}) => {
  const session = await getServerSession(authOptions)
  return <>
    <Button variant='default' size='lg'>This is a button</Button>
    
  </>
}

export default page