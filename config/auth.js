module.exports = {

    'development': true,
    'googleAuth': {
        'clientID': process.env.GOOGLE_CLIENT_ID || 'clientID',
        'clientSecret': process.env.GOOGLE_CLIENT_SECRET || 'clientSecret',
        'callbackURL': process.env.GOOGLE_CALLBACK_URL || 'http://cmm-rhodebump.rhcloud.com:3000/auth/google/callback'

    }

};