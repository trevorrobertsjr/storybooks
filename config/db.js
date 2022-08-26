const mongoose = require('mongoose')

const MONGO_URI = `mongodb+srv://mongo:${process.env.MONGOPW}@cluster0.ooihwh0.mongodb.net/storybooks?retryWrites=true&w=majority`

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI)
        console.log(`Connected to Mongo: ${conn.connection.host}`)

    } catch (err) {
        console.error(`Try setting the Mongo PW environment variable: ${err}`)
        process.exit(1)

    }
}

module.exports = connectDB