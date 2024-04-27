import dotenv from 'dotenv';

dotenv.config();

export default {
    databaseUrl: process.env.DATABASE_URL,

    port: parseInt(process.env.PORT || '5000'),

    saltWorkFactor: parseInt(process.env.SALTWORKFACTOR || '10'),

    accessTokenPrivateKey: process.env.ACCESS_PRIVATE_KEY,
    accessTokenPublicKey: process.env.ACCESS_PUBLIC_KEY,
    refreshTokenPrivateKey: process.env.REFRESH_PRIVATE_KEY,
    refreshTokenPublicKey: process.env.REFRESH_PUBLIC_KEY,

    accessTokenTtl: '8h',
	refreshTokenTtl: '2M',

    cookieTtl: 5.256e+9,

    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,

    clientUrl: process.env.CLIENT_URL,
    selfUrl: process.env.SELF_URL
};