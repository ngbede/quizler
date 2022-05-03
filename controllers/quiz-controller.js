const Quiz = require("../models/quiz")
const {Types} = require("mongoose")
const serverErrorMsg = require("../util/sever-error")

const getMainPath =  (req, res) => {
    console.log(req.user);
    res.status(200).json({
        message: "Quizler App API"
    })
}

const getQuiz = async (req, res) => {
    // A query parameter called quizCode can be added to url to query for a quiz by its code
    const quizCode = req.query.quizCode
    if(quizCode){
        const query = Quiz.find({code: quizCode})
        // run query
        try {
            const data = await query.exec() 
            if (data.length > 0){
                data[0].questions.forEach(question => {
                    delete question.answer
                }); 
                return res.status(200).json(data[0])
            }
            return res.status(404).json({message: `invalid quiz code`})
            
        } catch (err) {
            console.log(err);
            return res.status(500).json(serverErrorMsg)
        }
    }
    Quiz.find().then(data => {
        // data could be an empty array if nothing exists
        return res.status(200).json(data)
    }).catch(err => {
        console.log(err);
        return res.status(500).json(serverErrorMsg)
    })
}

const getQuizViaId = (req, res) => { 
    // optimize querying by checking id value for correctness
    const docId = req.params.id
    const validId = Types.ObjectId.isValid(docId)
    if (!validId) return res.status(404).json({message: "Invalid ID sent"})
    else {
        const query = Quiz.findOne({_id: docId})
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

const createNewQuiz =  (req, res) => {
    const payload = req.body
    Quiz.validate(payload).then( _ => {
        Quiz.create(payload)
        .then(data => {
            return res.status(200)
            .json({
                message: "new Quiz created successfully", 
                quizId: data._id, 
                quizCode: data.code, 
                statusCode: 200
            })
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json(serverErrorMsg)
        })
    }).catch(err => {
        // TODO: still some validation cases that need some refactor
        let errors = []
        Object.keys(err.errors).forEach(msg => {
            const field = err.errors[msg].path
            const validationError = err.errors[msg].kind
            if(validationError === "min") {
                errors.push(` '${field}' must be greater than 0`)
            } else {
                errors.push(` '${field}' is ${validationError}`)
            }
        })
        const message = err._message
        return res.status(404).json({message: message, invalidFields: errors})
    })
}

const updateQuiz = (req, res) => {
    const docId = req.params.id
    const validId = Types.ObjectId.isValid(docId)
    const payload = req.body
    if (!validId) return res.status(404).json({message: "Invalid ID sent"})
    else {
        if (Object.keys(payload).length === 0){
            return res.status(404).json({message: "Invalid request: send a valid request body"})
        } else {
            // TODO: provide a way to incrementatlly update questions in a quiz i.e don't overwrite everything
            // we don't want to update the code, userId and createdAt fields
            const keys = Object.keys(payload)
            const schemaKeys = Object.keys(Quiz.schema.obj) // get the fields in our schema

            const filteredKeys = schemaKeys.filter( value => {
                return (value !== "userId") && (value !== "code") && (value !== "createdAt")
            }) // these are the only fields we can update
            
            // basically just trying to filter out any extra fields from getting added
            let updatedObj = {}
            let fieldsUpdated = []
            for (const key of filteredKeys) {
                const valExist = keys.find(val => val === key)
                if (valExist) {
                    updatedObj[valExist] = payload[valExist]
                    fieldsUpdated.push(valExist)
                }
            }
            // before doing update check if for updatedObj even had anything added to it
            if (Object.keys(updatedObj).length === 0)  return res.status(404).json({message: "Invalid request: send a valid request body"})
            Quiz.updateOne({_id: docId}, {...updatedObj, updatedAt: Date.now()})
            .then(response => {
                if (response.acknowledged) return res.status(200).json({message: `Quiz with id ${docId} updated successfully`, fieldsUpdated: fieldsUpdated})
                else return res.status(204).json({message: "Unable to update quiz object"})
            })
            .catch(err => {
                console.log(err);
                return res.status(500).json(serverErrorMsg)
            })
        }
    }
}

const deleteQuiz = (req, res) => {
    const docId = req.params.id
    const validId = Types.ObjectId.isValid(docId)
    
    if (!validId) return res.status(404).json({message: "Invalid ID sent"})
    else {
        const query = Quiz.deleteOne({_id: docId})
        query.exec((error, data) => {
            if (error) return res.status(500).json(serverErrorMsg)
            if (data.deletedCount <= 0){
                return res.status(202).json({message: `Unable to delete quiz with id ${docId}, please check that the ID is valid`})
            }
            return res.status(200).json({message: `Quiz with id ${docId} deleted successfully`})
        }) 
    }
}

module.exports = {
    getMainPath,
    getQuiz,
    getQuizViaId,
    createNewQuiz,
    updateQuiz,
    deleteQuiz,
}