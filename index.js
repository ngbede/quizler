const express = require("express")
const cors = require("cors")
const connectMongo = require("./config/db")
const app = express()
const invalidRequest = require("./routes/invalid-request").getInvalidRequest
const quizRoute = require("./routes/quiz-route")
const testRoute = require("./routes/test-route")
const userRoute = require("./routes/user-route");

app.use(cors({
    methods: ["GET", "POST", "PATCH", "DELETE"]
}))
app.options("*", cors()) // disable cors
app.use((req,res,next) => {
    // enable auth header
    res.setHeader("Access-Control-Allow-Headers","Content-Type", "Authorization")
    next()
})
app.use(express.json())

app.use("/api", quizRoute)
app.use("/api", testRoute)
app.use("/api", userRoute)
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
