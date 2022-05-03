require("dotenv/config")
const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    // don't include tokens in req body
    // parse tge token in the request header
    const token = req.get("Authorization") // get auth token from the header
    if (!token) return res.status(404).json({message: "Invalid request, send an Auth header"})
    let parsedToken
    try{
        parsedToken = jwt.verify(token, process.env.private_key)
    } catch (e) {
        return res.status(404).json(e)
    }

    // the parsedToken object could be undefined
    if (!parsedToken) return res.status(401).json({message: "invalid token", message: "session expired"})
    req.user = parsedToken
    next()
}
