const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Generate a random string
function generateRandomString() {
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

// client route request to create new entry in database
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// server updates database with new entry from form and redirects to newly created URL

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  // console.log(longURL);
  const shortURL = generateRandomString();

  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
  // res.redirect("/urls");
});

// route paramater to display requested data by key in database

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    // edit: false
  };
  res.render("urls_show", templateVars);
});

// A redirect to the querried
app.get("/u/:shortURL", (req, res) => {
  // const longURL = req.params.shortURL...
  const longURL = req.params.shortURL;
  res.redirect(`/urls/${longURL}`);
  // console.log(req.body);

  // res.redirect(`/urls/${req.body}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  // console.log(req.params.shortURL);
  const shortURL = req.params.shortURL;
  // delete urlDatabase[req.params.shortURL];
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  // console.log(req.body.editlongURL);
  urlDatabase[shortURL] = req.body.editlongURL;

  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
