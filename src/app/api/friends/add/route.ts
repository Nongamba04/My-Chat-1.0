import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { addFriendValidator } from "@/lib/validations/addFriend"
import { getServerSession } from "next-auth"
import { z } from "zod"

export async function POST(req: Request){
  try {
    const body = await req.json()

    const {email: emailToAdd} = addFriendValidator.parse(body.email)//emailToAdd is the variable

    console.log('get id',emailToAdd)

    const idToAdd = await fetchRedis("get",`user:email:${emailToAdd}`) as string

    if(!idToAdd){//If the id is null which means the person doesnt exist in the db
      return new Response('This person doesnt exist.',{status:400})
    }

    const session = await getServerSession(authOptions)//get this session serverside as it is more safe

    if(!session){//if there is no session i.e the req is invalid 
      return new Response('Unauthorized',{status: 401})
    }

    if(idToAdd === session.user.id){//The person is sending a friend req to themselve
      return new Response('Cant do that ! Sorry....',{status: 400})
    }

    //check if user is already added
    const isAlreadyAdded = (await fetchRedis("sismember", `user:${idToAdd}:incoming_friend_requests`, session.user.id) )as 0 | 1

    if(isAlreadyAdded){
      throw new Response('Already Added',{status: 400})
    }
    //check if user is already added
    const isAlreadyFriends = (await fetchRedis("sismember", `user:${session.user.id}:incoming_friend_requests`, idToAdd) )as 0 | 1

    if(isAlreadyFriends){
      throw new Response('Already Friends',{status: 400})
    }
   
    // valid req, add friends

    db.sadd(`user:${idToAdd}:incoming_friend_requests`,session.user.id)
    return new Response('Ok')
    
  } catch (error) {
    if(error instanceof z.ZodError){
      throw new Response('Invalid request payload', {status: 407})
    }

    return new Response('Invalid Request', {status:400})
  }
}