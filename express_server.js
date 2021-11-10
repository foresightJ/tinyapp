const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Generate a random string

function generateRandomString() {
  return `${Math.random().toString(36).slice(2)}`;
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
  res.send("Ok");
  // res.render("urls_new");
});

// route paramater to display requested data by key in database

app.get("/urls/:id", (req, res) => {
  // console.log(req.params); /** --> { shortURL: 'gddd' } */
  const id = req.params.id;
  let longUrl;
  if (id) {
    longUrl = urlDatabase[id];
  } else {
    res.send("no Id");
  }

  // if (!urlDatabase[shortURL]) {
  //   res.send("sorry url does not exist");
  //   return;
  // }
  const templateVars = {
    // shortURL: req.params.shortURL,
    shortURL: id,
    longURL: longUrl,
  };
  // console.log(templateVars);
  res.render("urls_show", templateVars);
});

// app.get("/u/:shortURL", (req, res) => {
//   // const longURL = ...
//   res.redirect(longURL);
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
