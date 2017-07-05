var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//  delete urlDatabase(b2xVn2);
  delete urlDatabase["b2xVn2"];

  let templateVars = { urls: urlDatabase };

console.log(templateVars);
// console.log(Object.keys(templateVars));

var a = templateVars['urls'];
console.log(a);

//console.log(templateVars[urls]);

console.log("HERE");

const urls = templateVars.urls;

    Object.keys(urls).forEach(function(shortURL) { 
        console.log('shortURL:', shortURL );
        console.log('longURL:', urls[shortURL] );
    });


