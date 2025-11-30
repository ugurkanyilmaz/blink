import ioredis from "ioredis";
import config from "./env";

const redis = new ioredis({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
    db: config.redis.db,
});

export default redis;
