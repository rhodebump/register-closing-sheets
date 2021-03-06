var express = require('express');
var router = express.Router();
var configAuth = require('../config/auth.js');

router.get('/', function (req, res) {
    res.render('index', {
        title: 'Color Me Mine',
        user: req.user
    });
});

router.get('/daysheet', isLoggedIn, function (req, res) {
    res.render('newsheet', {
        title: 'Daysheet'
    })
});


router.get('/daysheetlist', isLoggedIn, function (req, res) {
    res.render('daysheetlist', {
        title: 'Daysheets'
    })

});



router.post('/togglehidden', isLoggedIn, function (req, res) {
    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    //var daysheetdate = req.body.daysheetdate;
    // Set our collection
    var collection = db.get('daysheetcollection');

    collection.findOne({
        _id: req.body._id
    }, function (err, doc) {
        console.log("found one");

        if (doc.hidden != null) {
            if (doc.hidden == 'true') {
                doc.hidden = 'false';
            } else {
                doc.hidden = 'true';
            }

        } else {
            doc.hidden = "true";
        }

        updateDB(collection, req, res, doc);

        daysheetDest(req, res, doc);

    });




});
router.post('/savesheet', isLoggedIn, function (req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    //var daysheetdate = req.body.daysheetdate;
    // Set our collection
    var collection = db.get('daysheetcollection');

    var daysheet = {
        "hidden": req.body.hidden,
        "submit_daysheet": req.body.submit_daysheet,
        "store": req.body.store,
        "openername": req.body.openername,
        "closername": req.body.closername,
        "processdate": req.body.processdate,
        "open_1cent": req.body.open_1cent,
        "open_5cents": req.body.open_5cents,
        "open_10cents": req.body.open_10cents,
        "open_25cents": req.body.open_25cents,
        "open_1dollar": req.body.open_1dollar,
        "open_5dollars": req.body.open_5dollars,
        "open_10dollars": req.body.open_10dollars,
        "open_20dollars": req.body.open_20dollars,
        "open_50dollars": req.body.open_50dollars,
        "open_100dollars": req.body.open_100dollars,
        "open_total": req.body.open_total,
        "close_1cent": req.body.close_1cent,
        "close_5cents": req.body.close_5cents,
        "close_10cents": req.body.close_10cents,
        "close_25cents": req.body.close_25cents,
        "close_1dollar": req.body.close_1dollar,
        "close_5dollars": req.body.close_5dollars,
        "close_10dollars": req.body.close_10dollars,
        "close_20dollars": req.body.close_20dollars,
        "close_50dollars": req.body.close_50dollars,
        "close_100dollars": req.body.close_100dollars,
        "close_total": req.body.close_total,
        "income_cash_store": req.body.income_cash_store,
        "income_debits": req.body.income_debits,
        "income_checks": req.body.income_checks,
        "income_credit_card": req.body.income_credit_card,
        "income_coupon": req.body.income_coupon,
        "income_receipts": req.body.income_receipts,
        "income_gift_certificate_redeemed": req.body.income_gift_certificate_redeemed,
        "income_deposit_redeemed": req.body.income_deposit_redeemed,
        "income_total": req.body.income_total,
        "totala": req.body.totala,
        "totalb": req.body.totalb,
        "difference": req.body.difference,
        "income_cash_tips": req.body.income_cash_tips,
        "bisque_sales": req.body.bisque_sales,
        "paint_time": req.body.paint_time,
        "child_party": req.body.child_party,
        "adult_party": req.body.adult_party,
        "party_deposit": req.body.party_deposit,
        "gift_certificates_sold": req.body.gift_certificates_sold,
        "credit_card_tips": req.body.credit_card_tips,
        "sub_total_sales": req.body.sub_total_sales,
        "sales_tax": req.body.sales_tax,
        "gross_sales": req.body.gross_sales

    };
    // Submit to the DB
    console.log(daysheet);
    console.log(req.body._id);

    if (req.body._id) {
        console.log("doing update");
        collection.findOne({
            _id: req.body._id
        }, function (err, existingDaysheet) {
            console.log("found one");
            console.log("submit_daysheet=" + existingDaysheet.submit_daysheet);

            if (is_editable(req, res, existingDaysheet)) {
                console.log("it is editable");
                updateDB(collection, req, res, daysheet);
                sendEmail(req, daysheet);
                daysheetDest(req, res, existingDaysheet);
            } else {
             console.log("it is NOT editable");
                console.log("cannot save daysheet");
                //res.send("Can not save daysheet that was previously submitted");
                req.flash('error', 'Can not save daysheet that was previously submitted');
                res.location("daysheet");
                res.redirect("daysheet?id=" + existingDaysheet._id);


            }
        });
    } else {
        console.log("doing insert");
        collection.insert(daysheet, function (err, savedDaysheet) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            } else {
                // If it worked, set the header so the address bar doesn't still say /adduser

                sendEmail(req, daysheet);
                daysheetDest(req, res, savedDaysheet);
            }
        });
    }

});



router.get('/api/daysheet/search', isLoggedIn, function (req, res) {

    var db = req.db;
    var startdate = req.param('startdate');
    var enddate = req.param('enddate');
    var hidden = req.param('hidden');


    var store = req.param('store');
    console.log('store', req.params);
    var query = {};
    if (store) {
        query["store"] = store;
    }
    if (hidden) {
        query["hidden"] = 'true';
    } else {
        //by default, only show not hidden daysheets
        //since the hidden field was added after the fact, 
        //instead of testing for false value, we are 
        //using the ne test
        //query["hidden"] = ' false';
        query["hidden"] = {
            "$ne": 'true'
        };

    }


    if (startdate && enddate) {

        query["processdate"] = {
            "$gte": startdate,
            "$lt": enddate
        };

    } else if (startdate) {
        query["processdate"] = {
            "$gte": startdate
        };

    } else if (enddate) {
        query["processdate"] = {
            "$lt": enddate
        };

    }
    console.log("query=", query);

    var collection = db.get('daysheetcollection');
    //sort by date asc
    var options = {
        "limit": 100,
        "skip": 0,
        "sort": "processdate"
    }
    
    
    collection.find(query,options, function (e, docs) {
        res.json(docs);
    });



});


router.get('/api/daysheet/:id', isLoggedIn, function (req, res) {

    var db = req.db;
    var id = req.params.id;
    var collection = db.get('daysheetcollection');
    collection.findOne({
        _id: id
    }, function (err, doc) {
        res.json(doc);
    });

});


function updateDB(collection, req, res, daysheet) {

    console.log("running  collection.updateById");

    collection.updateById(req.body._id, daysheet, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        } else {


        }
    });
}



// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    if (configAuth.development) {
        console.log("isLoggedIn true dev");
        return next();
    }
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/google');
}

//only editable if not submitted, or by me (phillip)
function is_editable(req, res, daysheet) {

    if (req.user.id == '115618015950485327602') {
        return true;
    } else if (daysheet.submit_daysheet != null) {
        return false;
    } else {
        return true;
    }
}


function daysheetDest(req, res, daysheet) {

    if (daysheet.submit_daysheet != null) {
        req.flash('info', 'Daysheet Submitted');
        // req.flash('info', 'Flash Message Added');
        res.location("daysheetlist");
        res.redirect("daysheetlist");

    } else {
        req.flash('info', 'Daysheet Saved');
        res.location("daysheet");
        res.redirect("daysheet?id=" + daysheet._id);
    }



}

function sendEmail(req, daysheet) {
    //only email submits
    if (daysheet.submit_daysheet == null) {
        return;
    }


    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: "Phillip Rhodes <rhodebumplist@gmail.com.com>", // sender address
        to: "rhodebump@gmail.com", // list of receivers
        subject: "Daysheet Submit", // Subject line
        text: "text ",
        html: JSON.stringify(daysheet)

    }

    var smtpTransport = req.smtpTransport;

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
        }

        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });

}

module.exports = router;