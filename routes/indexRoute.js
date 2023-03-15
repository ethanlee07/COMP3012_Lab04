const express = require("express");
const router = express.Router();
const { ensureAuthenticated} = require("../middleware/checkAuth");

const sessions = [];

router.get("/", (req, res) => {
  res.send("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});

router.get("/admin", ensureAuthenticated, (req, res) => {
  req.sessionStore.all((err, sessions) =>{
    if(err){
      console.log(err);
    }
    res.render("admin", {
      sessions,
      user: req.user,
    })
  });
})

router.post('/admin', (req, res) => {
  const sessionId = req.body.sessionId;
  req.sessionStore.destroy(sessionId, (err) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect('/admin');
    }
  });
});


module.exports = router;