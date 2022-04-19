const express = require("express")
const cors = require("cors")
const connectMongo = require("./config/db")
const app = express()
const invalidRequest = require("./routes/invalid-request").getInvalidRequest
const quizRoute = require("./routes/quiz-route")
const testRoute = require("./routes/test-route")

app.use(cors({
    methods: ["GET", "POST", "PATCH", "DELETE"]
}))
app.options("*", cors()) // disable cors
app.use(express.json())

app.use("/api", quizRoute)
app.use("/api", testRoute)
app.use(invalidRequest)
// create connection to mongodb
const port = process.env.PORT || 3001
connectMongo()
.then( _ => {
    console.log("Connected to DB!");
    console.log(`Running on port ${port}`);
    app.listen(port)    
})
.catch(err => {
    throw err // unable to connect to our servers
})
