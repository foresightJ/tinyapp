const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Generate a random string

function generateRandomString() {
  // console.log(Math.random().toString(36).slice(2, 8));
  return `${Math.random().toString(36).slice(2, 8)}`;
}

// Reference database with our longURLs

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// urls endpoint/route to display our database

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// urls endpoint/route to display input form to update database with

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// response message to display to client after update

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const { longURL } = req.body;
  const shortURL = generateRandomString();
  // res.render("urls_new");
  // const {shortURL, longURL} = urlDatabase;
  urlDatabase[shortURL] = longURL;
  // console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
  // res.redirect("/urls/:shortURL");
});

// route paramater to display requested data by key in database

app.get("/urls/:shortURL", (req, res) => {
  // console.log(req);
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    /* What goes here? */
  };
  console.log(templateVars);
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  // const longURL = req.params.shortURL...
  const longURL = req.params.shortURL;
  res.redirect(`/urls/${longURL}`);
  // console.log(req.body);

  // res.redirect(`/urls/${req.body}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
