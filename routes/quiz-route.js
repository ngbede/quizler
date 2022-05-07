const express = require("express");
const router = express.Router()
const quizController = require("../controllers/quiz-controller")
const isAuth = require("../middleware/verify-token")


router.get("/", isAuth, quizController.getMainPath)
router.get("/quiz/sheet/:quizCode", quizController.getQuizSheet)
router.get("/quiz", isAuth, quizController.getQuiz)
router.get("/quiz/:id", isAuth, quizController.getQuizViaId)
router.post("/quiz", isAuth, quizController.createNewQuiz)
router.patch("/quiz/:id", isAuth, quizController.updateQuiz)
router.delete("/quiz/:id", isAuth, quizController.deleteQuiz)

module.exports = router