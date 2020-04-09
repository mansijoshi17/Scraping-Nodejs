var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
const cron = require('node-cron');
let mysql = require('mysql');





var jsonarry = [];

app.get('/scrape', function (req, res) {


    // --------------------------- COINTOPPER-SCRAPING----------------------------------------//

    url = 'https://cointopper.com/';

    cron.schedule('*/1 * * * *', () => {

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
                    console.log(price);
                    var marketcaptd = $(element).find('td')[8];
                    var marketcap = $(marketcaptd).find('a > div').text().trim().replace(/[^a-z\d\s]+/gi, "");
                    var json = { name: name, change: change, price: price, coins: coins, imageurl: imgurl, marketcap: marketcap }
                    jsonarry.push(json);


                    // Configure MySQL connection
                    var connection = mysql.createConnection({
                        host: 'localhost',
                        user: 'root',
                        password: 'qwe123qwe',
                        database: 'cointopper_data'
                    })

                    // update statment
                    let sql = `UPDATE coindata
                       SET imgurl = ?, name = ?, mValue = ?, price = ?, coins = ?, mCap = ?
                       WHERE name = ?`;
                    var data = [imgurl, name, change, price, coins, marketcap, name];

                    connection.query(sql, data, (error, results, fields) => {
                        if (error) {
                            return console.error(error.message);
                        }
                        // console.log(`rows updated`);
                    });

                    connection.end();

                });


            }

            // To write to the system we will use the built in 'fs' library.
            // In this example we will pass 3 parameters to the writeFile function
            // Parameter 1 :  output.json - this is what the created filename will be called
            // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
            // Parameter 3 :  callback function - a callback function to let us know the status of our function

            // fs.writeFile('output.json', JSON.stringify(jsonarry, null, 4), function (err) {

            //     console.log('File successfully written! - Check your project directory for the output.json file');

            // })




            // --------------------------- COINTOPPER-SCRAPING----------------------------------------//

        });
    });
    res.send("Check console");
})



app.listen('8000')
console.log('Magic happens on port http://localhost:8000/scrape');
exports = module.exports = app;

