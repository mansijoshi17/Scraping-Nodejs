var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function (req, res) {



    url = 'http://studentdesk.in/new-arrivals';

    request(url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var jsonarry = [];
            console.log("I am scrap")

            // #booktokenclass > book-list > div.book-list > div > div:nth-child(1) > div.details-bx.hidden-xs > a > h3

            // #booktokenclass > book-list

            $("#booktokenclass").each((index, element) => {
                console.log("In");
                console.log("heyasdddyy", $(element).find('book-list'));
                //  kiya Aab kya karu?
                
                // var div = $(element).find('div.details-bx.hidden-xs');
                // var t = $(div).find('a > h3').text();
                // console.log("title", t);
            })
        }


        fs.writeFile('output.json', JSON.stringify(jsonarry, null, 4), function (err) {

            console.log('File successfully written! - Check your project directory for the output.json file');

        })

        // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
        res.send('Check your console!')

    });
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;

