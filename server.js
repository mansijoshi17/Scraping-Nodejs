var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');

var jsonarry = [];

app.get('/scrape', function (req, res) {

    // --------------------------- COINTOPPER-SCRAPING----------------------------------------//

    url = 'https://cointopper.com/';

    request(url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);


            $("#MyTable > tbody > tr").each((index, element) => {
                var imgtd = $(element).find('td')[1];
                var imgurl = $(imgtd).find('a > span > img').attr('src');
                var nametd = $(element).find('td')[2];//this get particular column like its consider index from 0 that's why we write 2 index for 3rd number column.
                var name = $(nametd).find('div > a > b').text();//this get that particular value of nested child from that td.
                var changetd = $(element).find('td')[3];
                var change = $(changetd).find('a > div > span').text().trim().replace(/[^a-z\d\s]+/gi, "");
                var coinstd = $(element).find('td')[7];
                var coins = $(coinstd).find('a > div').text().trim();
                var pricetd = $(element).find('td')[4];
                var price = $(pricetd).find('a > div.tbl-price.coin-price-value').text().trim().replace(/[^a-z\d\s]+/gi, "");
                var marketcaptd = $(element).find('td')[8];
                var marketcap = $(marketcaptd).find('a > div').text().trim().replace(/[^a-z\d\s]+/gi, "");
                jsonarry.push({ name: name, change: change, price: price, coins: coins, imageurl: imgurl, marketcap: marketcap });
            });


        }

        // To write to the system we will use the built in 'fs' library.
        // In this example we will pass 3 parameters to the writeFile function
        // Parameter 1 :  output.json - this is what the created filename will be called
        // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
        // Parameter 3 :  callback function - a callback function to let us know the status of our function

        fs.writeFile('output.json', JSON.stringify(jsonarry, null, 4), function (err) {

            console.log('File successfully written! - Check your project directory for the output.json file');

        })


        // --------------------------- COINTOPPER-SCRAPING----------------------------------------//


        //----------------------------- MYSQL connection and add data --------------------------//

        // Configure MySQL connection
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'qwe123qwe',
            database: 'Cointopper'
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
            values.push([index, node.name, node.change, node.price, node.coins, node.imageurl, node.marketcap])
        })


        var sql = "INSERT INTO coindetails (id, name, marketValue, mPrice, coins, imgUrl, mCap) VALUES ?";
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
})


app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;

