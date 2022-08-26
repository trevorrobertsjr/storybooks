const express = require('express')
const router = express.Router()

// @desc Login/Landing page
// @route GET /

router.get('/', (request, response) => {
    response.render('login')
})

// @desc Dashboard page
// @route GET /dashboard

router.get('/dashboard', (request, response) => {
    response.render('dashboard')
})


module.exports = router