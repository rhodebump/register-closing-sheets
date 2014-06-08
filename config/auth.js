module.exports = {

    
    'googleAuth': {
        'clientID': process.env.GOOGLE_CLIENT_ID||'null',
        'clientSecret': process.env.GOOGLE_CLIENT_SECRET||'please_provide',
        'callbackURL': process.env.GOOGLE_CALLBACK_URL||'http://cmm-rhodebump.rhcloud.com/auth/google/callback'
    }

};