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
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
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

// helper function to check if email already exits in urlDatabase;
const checkEmail = (email) => {
  for (let user in users) {
    if (users[user].email === email) {
      return `${true}`;
    }
  }
};

// helper function to return user object if it exist;
const findUserEmail = (email) => {
  for (let user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
};

// helper function to get user object by id;
const getUserByid = (id) => {
  for (let user in users) {
    if (users[user].id === id) {
      return users[user];
    }
  }
};
// displays index list page of urlDatabase
app.get("/urls", (req, res) => {
  const user = getUserByid(req.cookies["user_id"]);
  // console.log(user);
  const templateVars = { urls: urlDatabase, user: user };
  res.render("urls_index", templateVars);
});

// displays form page to update urlDatabase
app.get("/urls/new", (req, res) => {
  // user = null
  if (!getUserByid(req.cookies["user_id"])) {
    res.redirect("/login");
  } else {
    const user = getUserByid(req.cookies["user_id"]);
    const templateVars = {
      user: user,
    };
    res.render("urls_new", templateVars);
  }
});

// create and updates urlDatabase with new url then redirects to urls list page
app.post("/urls", (req, res) => {
  // form data
  const { longURL, userId } = req.body;
  const shortURL = generateRandomString();
  newUrl = {
    longURL: longURL,
    userID: userId,
  };
  urlDatabase[shortURL] = newUrl;
  res.redirect(`/urls/${shortURL}`);
});

// displays specified url from urlDatabase
app.get("/urls/:shortURL", (req, res) => {
  const userId = req.cookies["user_id"];
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]["longURL"],

    // longURL: urlDatabase[shortURL],
    user: users[userId],
    // edit: false
  };
  // console.log(templateVars.longURL);
  res.render("urls_show", templateVars);
});

// A redirect to the corresponding longURL

app.get("/u/:shortURL", (req, res) => {
  if (!getUserByid(req.cookies["user_id"])) {
    res.send("Please log in first");
  } else {
    const user = getUserByid(req.cookies["user_id"]);
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL],
      user: user,
    };
    res.render("urls_show", templateVars);
  }
});

// deletes specifiesd entry from urlDatabase and redirects to urls page
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL].userID === req.body.userId) {
    delete urlDatabase[shortURL];
    res.redirect(`/urls`);
  } else {
    res.sendStatus(403);
  }

  // const shortURL = req.params.shortURL;
  // delete urlDatabase[shortURL];
  // res.redirect("/urls");
});

// displays form to update a specified data(url) in urlDatabase
app.get("urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const userId = req.cookies["user_id"];
  const templateVars = {
    user: users[userId],
    shortURL: shortURL,
    longURL: urlDatabase[shortURL]["longURL"],
  };

  res.render("urls_show", templateVars);
});

// updates urlDatabse with new value for its key(shortURL)
app.post("/urls/:shortURL/edit", (req, res) => {
  if (!getUserByid(req.cookies["user_id"])) {
    res.redirect("/login");
  } else {
    const user = getUserByid(req.cookies["user_id"]);
    const templateVars = {
      user: user,
    };
    res.render("urls_new", templateVars);
  }

  const shortURL = req.params.shortURL;
  urlDatabase[shortURL][longURL] = req.body.editlongURL;

  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  // check for login
  res.render("login_page");
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!checkEmail(email)) {
    res.sendStatus(403);
  } else {
    //if it exist get the user and set cookies to the user id
    const user = findUserEmail(email);

    if (password === user.password) {
      res.cookie("user_id", `${user.id}`);
      res.redirect("/urls");
    } else {
      res.sendStatus(403);
    }
  }
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
  // checks registration requirements
  if (email === "" || password === "" || checkEmail(email)) {
    res.sendStatus(403);
  } else {
    const user = {
      id: user_id,
      email: email,
      password: password,
    };
    // Defines User
    users[user_id] = user;
    res.cookie("user_id", `${user.id}`);
    // console.log("cookie:", `${user.id}`);
  }

  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
