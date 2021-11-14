const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieParser());

// Generate a random string
function generateRandomString() {
  return `${Math.random().toString(36).slice(2, 8)}`;
}

// Reference database with our longURLs
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

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

// urls endpoint/route to display our database
app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  const templateVars = { urls: urlDatabase, user: users[userId] };
  console.log(templateVars.user);
  res.render("urls_index", templateVars);
});

// client route request to create new entry in database
app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"];
  const templateVars = {
    user: users[userId],
  };
  res.render("urls_new", templateVars);
});

// server updates database with new entry from form and redirects to newly created URL

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();

  // const templateVars = {
  //   longURL: longURL,
  //   shortURL: shortURL
  // };

  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
  // res.redirect("/urls");
});

// route paramater to display requested data by key in database

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

// A redirect to the querried
// app.get("/u/:shortURL", (req, res) => {
//   // const longURL = req.params.shortURL...
//   const shortURL = req.params.shortURL;
//   const longURL = urlDatabase[shortURL]
//   res.redirect(`/urls/${longURL}`);
//   // console.log(req.body);

//   // res.redirect(`/urls/${req.body}`);
// });

// A redirect to the corresponding longURL
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  // const longURL = ...
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  // console.log(req.params.shortURL);
  const shortURL = req.params.shortURL;
  // delete urlDatabase[req.params.shortURL];
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.get("urls/:shortURL/edit", (req, res) => {
  // const shortURL = req.params.shortURL;
  const userId = req.cookies["user_id"];
  const templateVars = {
    user: users[userId],
  };

  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  // console.log(req.body.editlongURL);
  urlDatabase[shortURL] = req.body.editlongURL;

  res.redirect("/urls");
});

// app.get("/login", (req, res) => {
//   res.render("_header");
// });

app.post("/login", (req, res) => {
  // console.log(req.body);
  // res.cookie("username", `${req.body.username}`);
  // res.cookie("username", `${req.body.username}`);
  res.redirect("/urls");

  // console.log("cookie:", res.cookie.username);
});

app.post("/logout", (req, res) => {
  // console.log(req.body);
  // res.cookie("username", `${req.body.username}`);
  res.clearCookie("user_id");
  res.redirect("/urls");

  // console.log("cookie:", res.cookie.username);
});

app.get("/register", (req, res) => {
  res.render("register-user");
});

app.post("/register", (req, res) => {
  const user_id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  // const user = {
  //   id: user_id,
  //   email: email,
  //   password: password,
  // };

  const user = {
    id: user_id,
    email: email,
    password: password,
  };

  users[user_id] = user;
  res.cookie("user_id", `${user.id}`);
  console.log("user", user);
  console.log("user.id", user.id);
  console.log("user:", user);
  console.log("users:", users);
  console.log("cookie:", `${user.id}`);
  console.log(req.body);
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
