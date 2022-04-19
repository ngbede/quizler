const express = require("express");
const router = express.Router()
const quizController = require("../controllers/quiz-controller")

router.get("/", quizController.getMainPath)
router.get("/quiz", quizController.getQuiz)
router.get("/quiz/:id", quizController.getQuizViaId)
router.post("/quiz", quizController.createNewQuiz)
router.patch("/quiz/:id", quizController.updateQuiz)
router.delete("/quiz/:id", quizController.deleteQuiz)

module.exports = router