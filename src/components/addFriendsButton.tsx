'use client'
import { FC, useState } from 'react'
import Button from './ui/button'
import { addFriendValidator } from '@/lib/validations/addFriend'
import axios, { AxiosError } from 'axios'
import { z } from 'zod'
import { useForm, } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

interface AddFriendButtonProps {
  
}
//Converts the js to ts which is then used to validate the form input
type FormData = z.infer<typeof addFriendValidator>


const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
  const [isSuccess,setSuccess] = useState(false)
  
  //Check if the user email is not valid, if not handles
  //the error states
   const{register,handleSubmit,setError,formState:{errors}} = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  })
  const addFriend = async (email: string) =>{
    try{
      const validEmail = addFriendValidator.parse({email})

      await axios.post('/api/friends/add',{
        email: validEmail
      })

      setSuccess(true)
    }
    catch(error){
      if(error instanceof z.ZodError){
        setError('email',{message: error.message})
        return
      }

      if(error instanceof AxiosError){
        setError('email',{message: error.response?.data})
        return
      }

      setError('email',{message: 'Something Wrong Has Occured'})
    }
    
  }
  const onSubmit = (data: FormData) =>{
    addFriend(data.email)
  };
  return <form onSubmit={handleSubmit(onSubmit)} className='max-w-sm'>
    <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
      Add Friend with e-mail
    </label>

    <div className='mt-2 flex gap-4'>
      <input {...register('email')}type='text' className='block w-full rounded-e-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-300 sm-text-sm sm:leading-6' placeholder='you@email.com'/>
      <Button>Add</Button>
    </div>

    <p className='mt-2 font-med text-sm text-red-600'>{errors.email?.message}</p>
    
    {
      isSuccess ? (<p className='mt-2 font-med text-sm text-green-600'>Friend Request</p>) : null
    }
  </form>
}

export default AddFriendButton