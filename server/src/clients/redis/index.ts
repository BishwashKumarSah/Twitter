import Redis from "ioredis";

const UPSTASH_REDIS = process.env.UPSTASH_REDIS;

let client = null;
if (UPSTASH_REDIS) {
    client = new Redis(UPSTASH_REDIS);
    if(client){
        client.on('error',(error) => {
            console.log('Redis Error',error.message);
        })
        client.on("connect", () => console.log("Redis connected successfully."));
        client.on("reconnecting", () => console.log("Redis reconnecting..."));
        client.on("end", () => console.log("Redis connection closed."));
    }
} else {
    console.warn("Warning: UPSTASH_REDIS environment variable is not set. Redis will not be used.");
}

export  const redisClient = client;