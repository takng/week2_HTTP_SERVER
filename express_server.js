var express = require("express");

var app = express();
var PORT = process.env.PORT || 8080;

const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const password = "purple-monkey-dinosaur";
const hashed_password = bcrypt.hashSync(password, 10);
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ['key0'],
  maxAge: 60 * 60 * 1000
}));

app.set("view engine", "ejs");

let users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
  "user3RandomID": {
     id: "user3RandomID",
     email: "user3@example.com",
     password: "carwasher-funk"
   },
   "user4RandomID": {
      id: "user4RandomID",
      email: "user4@example.com",
      password: "washer-funk"
   }
}

var urlDatabase = {
  'b2xVn2': {
    'longURL': 'http://www.lighthouselabs.ca',
    'userID': 'user3RandomID'
  },
  '9s5xk': {
    'longURL': 'http://www.google.com',
    'userID': 'user4RandomID'
  }
};

function generateRandomString() {
    let random = Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
    return random;
};

function urlsForUser(thisUser) {
  const thisURLS = {};
  for (let shortURL in urlDatabase) {
    if (thisUser === urlDatabase[shortURL].userID) {
      thisURLS[shortURL] = urlDatabase[shortURL];
    }
  }
  return thisURLS;
};

// deleted cookie upon user logout
app.post('/logout', (req, res) => {
  //res.clearCookie('user_id');
  req.session = null;
  res.redirect('/');
});

app.get('/login', (req, res) => {
  let templateVars = { message: '', stat: res.statusCode };

  res.render('login', templateVars);

});

app.get("/list", (req, res) => {
  let templateVars = { urls: users };
  res.render("users_index", templateVars);
});

app.post('/login', (req, res) => {
  let uEmail = req.body.email;
  let uPassword = req.body.password;
  let templateVars = {};
  let found = false;
  let problem = false;
  let problemMessage = "";
  let foundUsersID = "";

  if (!uEmail || !uPassword) {
    console.log('Empty Input');
    problemMessage = 'Empty Input';
    problem = true;
  } else {
    for (let usersID in users) {
      let match = bcrypt.compareSync(uPassword, users[usersID].password);
      if (uEmail === users[usersID].email && match === true) {
        console.log('Email and Password match');
        foundUsersID = usersID;
        found = true;
      } else if (uEmail !== users[usersID].email) {
        console.log('Email doesn\'t match');
        problemMessage = 'Email doesn\'t match';
        problem = true;
      } else if (match !== true && uEmail === users[usersID].email) {
        console.log('Email matches but bad password');
        problemMessage = 'Email matches but bad password';
        problem = true;
      } else {
        problem = true;
        problemMessage = 'User not found'
      }
    }
  }

  if (found === true) {
    templateVars = {
      message: "",
      stat: res.statusCode
    };
    req.session.user_id = foundUsersID;
    res.redirect('/urls');
    //return;
  } else {
    if (problem === true) {
        res.statusCode = 403;
        templateVars = {
          message: problemMessage,
          stat: res.statusCode
        };
        res.status(403).send(problemMessage);
    };
  }
});


app.get('/register', (req, res) => {
  let templateVars = { message: '', stat: res.statusCode };
  res.render('register', templateVars);
});


app.post('/register', (req, res) => {
  let randUserID = generateRandomString();
  let uEmail = req.body.email;
  let uPassword = req.body.password;
  let templateVars = {};
  const hashedPwd = bcrypt.hashSync(uPassword, 10);
  let found = false;
  let problem = false;
  let problemMessage = "";
  let foundUsersID = "";

console.log(randUserID);
console.log(uEmail);
console.log(uPassword);

  if (!uEmail || !uPassword) {
    console.log('Empty Input');
    problemMessage = 'Empty Input';
    problem = true;
  } else {
    for (let usersID in users) {
      if (uEmail === users[usersID].email) {
        console.log('Email already used');
        //foundUsersID = usersID;
        problem = true;
      } else {
        problem = false;
      }
    }
  }

  if (problem === false) {
      req.session.user_id = randUserID;
      users[randUserID] = {
        id: randUserID,
        email: uEmail,
        password: hashedPwd
      };
      templateVars = { urls: users };
      res.render("login", templateVars);
  } else {
      if (problem === true) {
          res.statusCode = 400;
          templateVars = {
              message: problemMessage,
            stat: res.statusCode
          };
          res.status(400).send(problemMessage);
      };
  }

});

app.get("/u/:shortURL", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.id].userID) {
    let longURL = urlDatabase[shortURL].longURL;
    res.redirect(longURL);
  } else {
    res.status(403).send("url not belongs to you.");
  }
});

app.post("/urls/:id", (req, res) => {
        console.log(req.session.user_id);
        console.log(urlDatabase[req.params.id].userID);
  if (req.session.user_id === urlDatabase[req.params.id].userID) {
      urlDatabase[req.params.id].longURL = req.body.newURL;
      console.log(req.body.newURL);
  }
  let templateVars = { urls : urlsForUser(req.session.user_id) };
  res.render("urls_index", templateVars);
});

app.post("/urls/:id/delete", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.id].userID) {
      delete urlDatabase[req.params.id];
  }

  let templateVars = { urls : urlsForUser(req.session.user_id) };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  let randShortURL = generateRandomString();
  let longURL = `http://${req.body.longURL}`;

  if (req.session.user_id) {
    urlDatabase[randShortURL] = {
      'longURL': longURL,
      'userID': req.session.user_id
    };
    res.send("Ok");
  }
  else {
    res.status(403).send("Please log in");
  }
  
});

app.get("/urls", (req, res) => {
  let templateVars = { urls : urlsForUser(req.session.user_id) };
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  if (req.session.user_id !== urlDatabase[req.params.id].userID) {
      res.status(403).send("url not belongs to you");
  }
  else {
    let templateVars =
      {
        shortURL: req.params.id,
        longURL: urlDatabase[req.params.id].longURL
      };
    res.render("urls_show", templateVars);
  }
});

app.get('/', (req, res) => {
    res.redirect('/urls');
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
