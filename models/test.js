const mongoose = require("mongoose")
const {Schema} = mongoose

const testSchema = new Schema({
    name: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true
    },
    answers: { // send an array of answers for each question
        type: [], // length of items has to be equal with that of original questions
        of: Map, // {answer: "A"} || {answer: null} could add correct field to it
        required: true
    },
    quizId: {
        type: String,
        required: true
    },
    quizCode: {
        type: String,
        required: true
    },
    result: { // generated on the server
        type: Map, // {score: 5, totalQuestions: 20, answered: 15}
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

const Test = mongoose.model("Test", testSchema)
module.exports = Test