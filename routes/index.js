var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {
        title: 'Express'
    });
});
/* GET Hello World page. */
router.get('/helloworld', function (req, res) {
    res.render('helloworld', {
        title: 'Hello, World!'
    })
});

/* GET Hello World page. */
router.get('/newsheet', function (req, res) {
    res.render('newsheet', {
        title: 'New Daysheet'
    })
});


/* GET Userlist page. */
router.get('/daysheetlist', function (req, res) {
    var db = req.db;
    var collection = db.get('daysheetcollection');
    collection.find({}, {}, function (e, docs) {
        res.render('daysheetlist', {
            "daysheetlist": docs
        });
    });
});


router.post('/addsheet', function (req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var openername = req.body.openername;
    var closername = req.body.closername;
    var daysheetdate = req.body.daysheetdate;
    // Set our collection
    var collection = db.get('daysheetcollection');


    var daysheet = {
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
    collection.insert(daysheet, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        } else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("daysheetlist");
            // And forward to success page
            res.redirect("daysheetlist");
        }
    });




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




});



module.exports = router;