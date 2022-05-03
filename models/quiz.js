const mongoose = require("mongoose")
const {Schema} = mongoose
const shortid = require("shortid")

// first create the data schema
const quizSchema = new Schema({
    // define the types here
    name: {
        type: String,
        required: true
    },
    userId: String, // the user who made the quiz
    duration: { // this is in minutes
        type: Number,
        required: true,
        min: 1
    },
    active: {
        type: Boolean,
        default: true
    },
    code: { // used to access a quiz
        type: String,
        default: shortid.generate
    },
    questions: { // an array of questions
        type: [],
        of: Map,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

})

// then export it as a model

const Quiz = mongoose.model("Quiz", quizSchema)

module.exports = Quiz