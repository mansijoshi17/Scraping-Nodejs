var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cors = require('cors');


app.use(cors());

// //---------------------------------  REST API -----------------------------------------//

// Configure MySQL connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qwe123qwe',
    database: 'cointopper_data'
})

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


//rest api to get all coins details
app.get('/api/coins', function (req, res) {
    connection.query('select * from coindata', function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});

app.listen('8002')
console.log('Magic happens on http://localhost:8002/api/coins');
exports = module.exports = app;