var express = require('express');
var router = express.Router();


router.get('/daysheetlist', function (req, res) {
    var db = req.db;
    var collection = db.get('daysheetcollection');
    collection.find({}, {}, function (e, docs) {
        res.render('daysheetlist', {
            "daysheetlist": docs
        });
    });
});


/*
 * GET userlist.
 */
router.get('/list', function (req, res) {
    var db = req.db;
    var collection = db.get('daysheetcollection');
    collection.find().toArray(function (err, items) {
        res.json(items);
    });
});




router.get('/get', function (req, res) {
    var db = req.db;
    var _id = req.body.id;
    console.log("id=" + _id);


    //    db.collection('daysheetcollection').find().toArray(function (err, items) {
    //        res.json(items);
    //    });
});


/*

router.get('/daysheetlist', function(req, res) {
    var db = req.db;
    var collection = db.get('daysheetcollection');
    collection.find({},{},function(e,docs){
        res.render('daysheetlist', {
            "daysheetlist" : docs
        });
    });
});

*/

module.exports = router;