const express = require("express");
const app = express();
const passport = require("passport");
const port = process.env.port || 3000;
const expressSession = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");
const md5 = require("md5");

require("./db/conn");

app.set("view engine", "hbs");

const User = require("./models/register");
const { json } = require("express");
const res = require("express/lib/response.js");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// session
app.use(
  expressSession({
    secret: "secret",
    resave: "false",
    saveUninitialized: false,
  })
);
// passport-session
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(User.authenticate()));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", function (req, res) {
  const user = new User({
    username: req.body.email,
    password: req.body.pass1,
  });
  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("passport-local")(req, res, function () {
        res.status(200).redirect("/dashboard");
      });
    }
  });
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

// local account creation
// app.post("/signup", async (req, res) => {
//   try {
//     const password = req.body.pass1;
//     const new_email = await User.findOne({ email: req.body.email });

//     if (new_email) return res.status(400).send("User Already Exists");

//     const regUser = new User({
//       firstname: req.body.firstname,
//       lastname: req.body.lastname,
//       email: req.body.email,
//       password: md5(req.body.pass1),
//     });
//     const registered = await regUser.save();
//     res.status(201).render("login");
//   } catch (err) {
//     res.status(404).send(err);
//   }
// });

// account createion with passport
app.post("/signup", function (req, res) {
  User.register(
    new User({
      username: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    }),
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/signup");
      } else {
        passport.authenticate("passport-local")(req, res, function () {
          res.status(200).redirect("/dashboard");
        });
      }
    });
});

app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("dashboard");
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  req.logout(req.user,(err)=> {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.listen(port, () => {
  console.log("Listening at port ", port);
});
