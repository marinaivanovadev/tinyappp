const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};
const generateRandomString = function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
// Helper function to ensure protocol (http:// or https://)
const ensureProtocol = (url) => {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `http://${url}`;
  }
  return url;
};

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];

  const templateVars = { id, longURL};
  res.render("urls_show", templateVars);
});

app.get("/test-random", (req, res) => {
  const randomString = generateRandomString();
  res.send(`Random String: ${randomString}`);
});
app.get("/u/:id", (req, res) => {
  const id = req.params.id; // Extract the id from the URL
  const longURL = urlDatabase[id]; // Look up the long URL in the database
  if (longURL) {
    res.redirect(longURL); // Redirect to the long URL
  } else {
    res.status(404).send("Short URL not found."); // Handle invalid IDs
  }
});


app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = ensureProtocol(req.body.longURL);

  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});