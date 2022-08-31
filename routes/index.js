const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Story = require('../models/Story')

// @desc Login/Landing page
// @route GET /

router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    })
})

// @desc Dashboard page
// @route GET /dashboard

router.get('/dashboard', ensureAuth, async (req, res) => {
    // console.log(req.user)
    try {
        // lean method passes stories as js objects
        // instead of mongoose objects to render
        // successfully
        const stories = await Story.find({ user: req.user.id }).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            stories
        })
        console.log(stories[0])
    } catch (err) {
        console.error(err)
        res.render('error/500')

    }

})


module.exports = router