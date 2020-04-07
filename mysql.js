var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');


var jsonarry = require('./output.json');

app.get('/insert/data', function (req, res) {

    //----------------------------- MYSQL connection and add data --------------------------//

    // Configure MySQL connection
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'qwe123qwe',
        database: 'cointopper_data'
    })

    //Establish MySQL connection
    connection.connect(function (err) {
        if (err)
            throw err
        else {
            console.log('Connected to MySQL');
        }
    });

    app.use(bodyParser.json());


    var values = [];

    jsonarry.map((node, index) => {
        values.push([index, node.imageurl, node.name, node.change, node.price, node.coins,  node.marketcap])
    })


    var sql = "INSERT INTO coindata (id, imgurl, name, 	mValue, price, coins, mCap) VALUES ?";
    // Bulk insert using nested array [ [a,b],[c,d] ] will be flattened to (a,b),(c,d)
    connection.query(sql, [values], function (err, result) {
        if (err) {
            console.log(err);
            res.send('Error');
        }
        else {
            res.send('Success! check phpmyAdmin');
        }
    });

    //----------------------------- MYSQL connection and add data --------------------------//

});

app.listen('8001')
console.log('Magic happens on port http://localhost:8001/insert/data');
exports = module.exports = app;
