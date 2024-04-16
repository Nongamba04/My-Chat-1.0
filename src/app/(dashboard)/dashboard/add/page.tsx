
import { FC } from 'react'
import AddFriendButton from '@/components/addFriendsButton'

const page:FC= ({}) => {
  return <main className='flex flex-col items-center justify-center pt-8'>
    <h1 className='font-bold text-5xl mb-8'>Add a Friend</h1>
    <AddFriendButton/>
  </main>
}

export default page