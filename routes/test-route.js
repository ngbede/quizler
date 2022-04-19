const express = require("express")
const router = express.Router()
const {getTest, getTestViaId, uploadTest} = require("../controllers/test-controller")

router.get("/test", getTest)
router.get("/test/:id", getTestViaId)
router.post("/test", uploadTest)

module.exports = router