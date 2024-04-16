const upstashRedishUrl = process.env.UPSTASH_REDIS_REST_URL
const authToken = process.env.UPSTASH_REDIS_REST_TOKEN

type Commands ='zrange' | 'sismember' | 'get' | 'smembers'

export async function fetchRedis(
    command: Commands,
    ...args: (string|number)[]
){
    const commandUrl = `${upstashRedishUrl}/${command}/${args.join('/')}`; 

    const response =  await fetch(commandUrl,
    { headers:
        {
            Authorization: `Bearer ${authToken}`//Upstash should know if you are authorized to access the db
        },
        cache: 'no-store'//not storing data and always sending new
    }
    )

    if (!response.ok){
        throw new Error(`Error in executing the command: ${response.statusText}`)
    }

    const data = await response.json()
    return data.result
}