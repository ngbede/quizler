const Test = require("../models/test")
const markTest = require("../util/marker")
const {Types} = require("mongoose")
const Quiz = require("../models/quiz");
const serverErrorMsg = require("../util/sever-error")

const getTest = (req,res) => {
    Test.find().then(data => {
        // data could be an empty array if nothing exists
        if (data.length > 0) return res.status(200).json(data)
        else return res.status(200).json({message: "No tests stored in the DB currently" ,data: data})
    }).catch(err => {
        console.log(err);
        return res.status(500).json(serverErrorMsg)
    })
}

const getTestViaId =  (req,res) => {
    // optimize querying by checking id value for correctness
    const docId = req.params.id
    const validId = Types.ObjectId.isValid(docId)
    if (!validId) return res.status(404).json({message: "Invalid ID sent"})
    else {
        const query = Test.findOne({_id: docId})
        query.exec()
        .then(data => {
            if (data) return res.status(200).json(data)
            else return res.status(404).json({message: `Quiz with id ${docId} doesn't exist`})
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json(serverErrorMsg)
        })
    }
}

const uploadTest = (req, res) => {
    const payload = req.body
    Test.validate(payload)
    .then( _ => {
        const queryTests = Test.exists({email: payload.email.toLowerCase()}).where("quizCode").equals(payload.quizCode)
        queryTests.exec((error, data) => {
            if (error) return res.status(500).json(serverErrorMsg)
            if (data) { // the data could be null
                return res.status(404).json({message: "test already taken using email"})
            } else {
                const quizId = payload.quizId
                Quiz.findOne({_id: quizId})
                .then(response => {
                    const markingScheme = response.questions
                    const testSlip = payload.answers
                    payload.email = payload.email.toLowerCase() // all emails in lowercase to aid queries
                    const {testResult, transformedAnswers} = markTest(markingScheme, testSlip);
                    delete payload.answers //remove the answers from the payload
                    Test.create({...payload, answers: transformedAnswers, result: testResult})
                    .then(data => {
                        return res.json(data)
                    }).catch(err => {
                        console.log(err);
                        return res.status(500).json(serverErrorMsg)
                    })
                }).catch(err => {
                    console.log(err);
                    return res.status(500).json(serverErrorMsg)
                })
            }
        })
    })
    .catch(err => {
        let errors = []
        Object.keys(err.errors).forEach(msg => {
            const field = err.errors[msg].path
            const validationError = err.errors[msg].kind
            errors.push(` '${field}' is ${validationError}`)
        })
        const message = err._message
        return res.status(404).json({message: message, invalidFields: errors})
    })
}

module.exports = {
    getTest,
    getTestViaId,
    uploadTest
}