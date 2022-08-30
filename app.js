const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
// const MongoStore = require('connect-mongo')(session)
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')
const mongoose = require('mongoose')

const MONGO_URI = `mongodb+srv://mongo:${process.env.MONGOPW}@cluster0.ooihwh0.mongodb.net/storybooks?retryWrites=true&w=majority`

// Load config
dotenv.config({ path: './config/config.env' });

//Passport config
require('./config/passport')(passport)

connectDB();

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method override
app.use(
    methodOverride(function (req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // look in urlencoded POST bodies and delete it
            let method = req.body._method
            delete req.body._method
            return method
        }
    })
)

// Logging in dev environment
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Handlebars Helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')

// Handlebars configuration
app.engine(
    '.hbs',
    exphbs.engine({
        helpers: {
            formatDate,
            stripTags,
            truncate,
            editIcon,
            select
        },
        defaultLayout: 'main', extname: '.hbs'
    }));
app.set('view engine', '.hbs');

// Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    // store: new MongoStore({ mongooseConnection: mongoose.connection })
    store: MongoStore.create({
        mongoUrl: MONGO_URI
    })
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Set global var for other pages to access logged in user
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
})
// Static files
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server runnning in ${process.env.NODE_ENV} on port ${process.env.PORT}`));