require('dotenv').config({ path: '../../.env' });

console.log('ENV VARS:', {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET'
});

module.exports = {
    googleClientID: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    cookieKey: process.env.COOKIE_KEY,
};