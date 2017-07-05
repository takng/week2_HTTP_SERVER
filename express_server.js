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

function generateRandomString() {

}

app.get('/u/:shortURL', (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);

//  if (req.params.shortURL !== urlDatabase[req.params.shortURL]) {
 //   res.status(404).render('404', templateVars);
//  };
});

//app.get("/u/:shortURL", (req, res) => {
//  let longURL = urlDatabase[shortURL];
//  res.redirect(longURL);
//});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
  //res.render("urls");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  // let templateVars = {
  //   shortURL: req.params.id,
  //   longURL: urlDatabase[req.params.shortURL]
  // };
  res.render("urls_index", templateVars);
//  res.render("urls_index", urlDatabase);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.shortURL]
  };
  //let templateVars = { shortURL: req.params.id };
  res.render("urls_show", templateVars);
});

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
