const express = require("express");
const passport = require("../middleware/passport");
const database = require("../models/userModel").database;
const { forwardAuthenticated } = require("../middleware/checkAuth");
const { userModel } = require("../models/userModel").userModel;

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => res.render("login"));

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
  }),
  (req, res) =>{
    const user = database.find((user) => user.email === req.body.email);
    if(user.role === 'admin'){
      res.redirect('/admin');
    }
    else{
      res.redirect('/dashboard');
    }
  }
);

router.get('/admin', (req, res) =>{
  req.session.destroy(req.sessionID);
  res.redirect('/admin');
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
});

router.get('/github',
  passport.authenticate('github'));

router.get('/github/callback', 
  passport.authenticate('github', { 
    successRedirect: '/dashboard',
    failureRedirect: '/auth/login', }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  });

module.exports = router;