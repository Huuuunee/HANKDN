const express = require('express')
const router = express.Router()
const passport = require('../passport.js')
require('passport')
 
router.get('/', (req, res) => {
    res.render('index.ejs')
})
 
router.post('/', passport.authenticate('local-login', {
    successRedirect : '/loginSuccess', 
    failureRedirect : '/loginFail', 
    failureFlash : true 
}))
 
router.get('/loginSuccess', (req, res) => {
    res.render('loginSuccess')
})
router.get('/loginFail', (req, res) => {
    res.render('loginFail')
})
 
 
module.exports = router