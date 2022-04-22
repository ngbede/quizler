require("dotenv/config")
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const serverErrorMsg = require("../util/sever-error")


const signup = (req, res) => {
    const payload = req.body
    User.validate(payload) // validate payloads data
    .then( _ => {
        // hash password before saving to the db
        const hashPassword = bcrypt.hashSync(payload.password, 10) 
        payload.password = hashPassword
        User.create(payload)
        .then( _ => {
            return res.json({message: "Account created successfully"})
        }).catch(err => {
            let errorCode = err.code
            let existingMail = err.keyValue.email
            if (errorCode === 11000) return res.status(404).json({message: `Account with email ${existingMail} already exists`})
            return res.status(500).json({...serverErrorMsg})
        })
    }).catch( err => {
        let errors = []
        Object.keys(err.errors).forEach(msg => {
            const errorMsg = err.errors[msg].properties.message
            errors.push(errorMsg)
        })
        const message = err._message
        return res.status(404).json({message: message, invalidFields: errors})
    })
}

const login = (req, res) => {
    const payload = req.body // expect only email & password
    payload.name = "lol" // just append this to bypass validation
    User.validate(payload)
    .then( _ => {
        const query = User.findOne({email: payload.email})
        query.exec()
        .then( user => { // user could be null
            if (!user) return res.status(404).json({message: `User acount doesn't exist`})
            const validPassword = bcrypt.compareSync(payload.password, user.password)
            if (!validPassword) return res.status(401).json({message: "Password is incorrect"})

            // if we reach here it means password is correct and we can create signed token for user to access server
            const ttl = "72h" // time to live for access token
            const accessToken = jwt.sign({...payload, id: user._id}, process.env.private_key, {expiresIn: ttl})
            const timeStamp = new Date()
            return res.status(200).json({
                message: "Login successful",
                accessToken: accessToken,
                useage: `Token expires in ${ttl}`,
                createdAt: timeStamp
            })
        })
        .catch( err => {
            console.log("Error: ",err);
            return res.status(404).json(err)
        })
    })
    .catch(err => {
        let errors = []
        Object.keys(err.errors).forEach(msg => {
            const errorMsg = err.errors[msg].properties.message
            errors.push(errorMsg)
        })
        const message = err._message
        return res.status(404).json({message: message, invalidFields: errors})
    })
    //res.json("lol")
}

module.exports = {
    signup,
    login
}