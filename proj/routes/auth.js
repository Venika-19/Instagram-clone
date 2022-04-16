const { urlencoded } = require("body-parser");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const {JWT_SECRET} = require("../keys") 
const jwt = require('jsonwebtoken')

router.get("/", (req, res) => {
  res.send("hello");
});

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "please fill all the fields" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "user already exists" });
      }

      bcrypt.hash(password, 12).then((hashpassword) => {
        const user = new User({
          email,
          password: hashpassword,
          name,
        });
        user
          .save()
          .then((user) => {
            console.log("user saved successfully");
            res.json({ message: "user saved successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin", (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: "Invalid email" });
      }
      bcrypt
        .compare(password, savedUser.password)
        .then((doMatch) => {
          if (doMatch) {
              const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
              res.json({token})
              return res.json({ message: "Successfully logged in" });
            }
            return res.status(422).json({ error: "Invalid password" });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
