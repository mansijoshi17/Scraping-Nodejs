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

    // cron.schedule('*/1 * * * *', () => {

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
                var json = { name: name, change: change, price: price, coins: coins, imageurl: imgurl, marketcap: marketcap }
                jsonarry.push(json);

                // --------------------------- COINTOPPER-SCRAPING----------------------------------------//


                //======================== Upadet Query ========================================//

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
                //======================== Upadet Query ========================================//


                //===================== Updating JSON file ===========================//

                function jsonReader(filePath, cb) {//callback
                    fs.readFile(filePath, (err, fileData) => {
                        if (err) {
                            return cb && cb(err)
                        }
                        try {
                            const object = JSON.parse(fileData)
                            return cb && cb(null, object)
                        } catch (err) {
                            return cb && cb(err)
                        }
                    })
                }


                jsonReader('./output.json', (err, jsonarry) => {
                    if (err) {
                        console.log('Error reading file:', err)
                        return
                    }
                    jsonarry.filter(node => node.name === name).map((node) => {
                        return node.name = name, node.change = change, node.price = price, node.coins = coins, node.imageurl = imgurl, node.marketcap = marketcap;
                    })
                    fs.writeFile('./output.json', JSON.stringify(jsonarry, null, 4), function (err) {

                        console.log('File successfully written! - Check your project directory for the output.json file');

                    })
                })


            });




        }

    });
    // });
    res.send("Check console");
})



app.listen('8000')
console.log('Magic happens on port http://localhost:8000/scrape');
exports = module.exports = app;

