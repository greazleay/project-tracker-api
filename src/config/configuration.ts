export default () => ({
    PORT: process.env.PORT ?? 3000,
    DB_HOST: process.env.TYPEORM_HOST,
    DB_PORT: process.env.TYPEORM_PORT,
    DB_USERNAME: process.env.TYPEORM_USERNAME,
    DB_PASSWORD: process.env.TYPEORM_PASSWORD,
    DB_DATABASE: process.env.TYPEORM_DATABASE,

    REDIS_HOST_URL: process.env.REDIS_HOST_URL,
    REDIS_USERNAME: process.env.REDIS_USERNAME,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_DATABASE_NAME: process.env.REDIS_DATABASE_NAME,

    ACCESS_TOKEN_PUBLIC_KEY: Buffer.from(process.env.ACCESS_TOKEN_PUBLIC_KEY_BASE64, 'base64').toString('ascii'),
    ACCESS_TOKEN_PRIVATE_KEY: Buffer.from(process.env.ACCESS_TOKEN_PRIVATE_KEY_BASE64, 'base64').toString('ascii'),
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_PUBLIC_KEY: Buffer.from(process.env.REFRESH_TOKEN_PUBLIC_KEY_BASE64, 'base64').toString('ascii'),
    REFRESH_TOKEN_PRIVATE_KEY: Buffer.from(process.env.REFRESH_TOKEN_PRIVATE_KEY_BASE64, 'base64').toString('ascii'),
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDER_IDENTITY: process.env.SENDER_IDENTITY
})