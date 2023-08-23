const express = require("express");
const app = express();
const passport = require("passport");
const port = process.env.port || 3000;
const { initializingPassport,isAuthenticated } = require("./passportConfig");
const expressSession = require("express-session");

require("./db/conn");

initializingPassport(passport);

app.set("view engine", "hbs");

const User = require("./models/register");
const { json } = require("express");
const res = require("express/lib/response.js");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  expressSession({
    secret: "secret",
    resave: "false",
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login",passport.authenticate('local', {
    failureRedirect: "/signup",
    successRedirect: "/dashboard"
  })
);

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  try {
    const password = req.body.pass1;
    const new_email = await User.findOne({ email: req.body.email });

    if (new_email) return res.status(400).send("User Already Exists");

    const regUser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.pass1,
    });
    const registered = await regUser.save();
    res.status(201).render("login");
  } catch (err) {
    res.status(404).send(err);
  }
});

app.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard");
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("home");
});

app.listen(port, () => {
  console.log("Listening at port ", port);
});
