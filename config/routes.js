module.exports = function (app, passport) {




    // route for logging out
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });


    
    app.get('/login', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));
    
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));


    app.get('/auth/google/callback',
        passport.authenticate('google', {
            failureRedirect: '/login'
        }),
        function (req, res) {
            // Successful authentication, redirect home.
            console.log("successful");
            res.redirect('/');
        });

    

};

