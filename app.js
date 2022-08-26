const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const connectDB = require('./config/db')

// Load config
dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();

// Logging in dev environment
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Handlebars configuration
app.engine('.hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

// Routes
app.use('/', require('./routes/index'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server runnning in ${process.env.NODE_ENV} on port ${process.env.PORT}`));