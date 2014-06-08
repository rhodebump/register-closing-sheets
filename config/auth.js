module.exports = {

    
    'googleAuth': {
        'clientID': process.env.GOOGLE_CLIENT_ID||'797028846880-0lq338v8gcq3clums5ur4t7rhqa67e1g.apps.googleusercontent.com',
        'clientSecret': process.env.GOOGLE_CLIENT_SECRET||'EblmWwhrx5dYEkKryB82olaZ',
        'callbackURL': process.env.GOOGLE_CALLBACK_URL||'http://cmm-rhodebump.rhcloud.com:3000/auth/google/callback'
    }

};