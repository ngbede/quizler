const mongoose = require("mongoose")
require("dotenv/config")

const connectMongo = () =>  mongoose.connect(process.env.db_url)

module.exports = connectMongo