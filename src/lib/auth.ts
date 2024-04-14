import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { db } from "./db";
import GoogleProvider from 'next-auth/providers/google'

//To find the google ids and credentials
const getGoogleCredentials =()=>{
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if(!clientId || clientId.length === 0){
        throw new Error("Missing Client Id")
    }
    if (!clientSecret || clientSecret.length === 0) {
        throw new Error("Missing Client Secret");
    }

    return {clientId,clientSecret}
}

export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(db),
    session:{
        strategy:'jwt',
    },
    pages:{
        signIn :'/login'
    },
    providers:[
        GoogleProvider({
            clientId: getGoogleCredentials().clientId,
            clientSecret:getGoogleCredentials().clientSecret
        }),
    ],
    callbacks:{
        async jwt ({token, user}) {
            const dbUser = (await db.get(`user:${token.id}`)) as User | null
            // If there is no user in the database then we add it to the DB with the token id as its key
            if(!dbUser ) {
                token.id = user!.id
                return token
            }

            //If the user  already exists in the DB then return its credntials
            return{
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                picture: dbUser.image
            }
        },
        async session({session, token}) {
            if(token){
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.picture

            }

            return session
        },
        redirect(){
            return '/dashboard'
        }
    }

}