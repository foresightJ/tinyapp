const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieParser());

// generates a random user_id
function generateRandomString() {
  return `${Math.random().toString(36).slice(2, 8)}`;
}

// Reference database with our longURLs
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// Our users database Object
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

// displays index list page of urlDatabase
app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  const templateVars = { urls: urlDatabase, user: users[userId] };
  console.log(templateVars.user);
  res.render("urls_index", templateVars);
});

// displays form page to update urlDatabase
app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"];
  const templateVars = {
    user: users[userId],
  };
  res.render("urls_new", templateVars);
});

// create and updates urlDatabase with new url then redirects to urls list page
app.post("/urls", (req, res) => {
  // form data
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();

  urlDatabase[shortURL] = longURL;

  // res.redirect("/urls");
  res.redirect(`/urls/${shortURL}`);
});

// displays specified url from urlDatabase
app.get("/urls/:shortURL", (req, res) => {
  const userId = req.cookies["user_id"];
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[userId],
    // edit: false
  };
  res.render("urls_show", templateVars);
});

// A redirect to the corresponding longURL OR
// keyed short url re-directs to the web address contained in its value
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  // const longURL = ...
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

// deletes specifiesd entry from urlDatabase and redirects to urls page
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

// displays form to update a specified data(url) in urlDatabase
app.get("urls/:shortURL/edit", (req, res) => {
  // const shortURL = req.params.shortURL;
  const userId = req.cookies["user_id"];
  const templateVars = {
    user: users[userId],
  };

  res.render("urls_show", templateVars);
});

// updates urlDatabse with new value for its key(shortURL)
app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.editlongURL;

  res.redirect("/urls");
});

// app.get("/login", (req, res) => {
//   res.render("_header");
// });

// update maybe needed on login POST route
app.post("/login", (req, res) => {
  res.redirect("/urls");
});

// logs out registered user
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// registration form
app.get("/register", (req, res) => {
  res.render("register-user");
});

// Updates users database with a newUserr and sets cookies with user_id and return to urldatabase page
app.post("/register", (req, res) => {
  // defines register-route  variables
  const user_id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  const user = {
    id: user_id,
    email: email,
    password: password,
  };

  // adds newUser to database
  users[user_id] = user;
  // sets cookie on user_id
  res.cookie("user_id", `${user.id}`);
  // console.log("user", user);
  // console.log("user.id", user.id);
  // console.log("users:", users);
  // console.log("cookie:", `${user.id}`);
  // console.log(req.body);
  // console.log(req.body.password);
  // console.log(req.body.email);

  // generate random alpha-numeric to store user id
  // eventually collect generated userid and set cookie with its value
  // push userId to database;

  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
