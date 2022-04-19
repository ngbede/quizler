// The marker function
// takes in 2 arguements

function markTest(questions, answers) {
    let score = 0
    let totalQuestions = questions.length
    let answered = 0

    for (let i = 0; i < questions.length; i++){
        if (answers[i].answer !== null){
            answered++
            if (questions[i].answer.toUpperCase() === answers[i].answer.toUpperCase()){
                score++
                answers[i]["correct"] = true
            } else{
                answers[i]["correct"] = false
            }
        } else {
            answers[i]["correct"] = false
        }
    }

    const result = {
        score: score,
        totalQuestions: totalQuestions,
        answered: answered
    }
    return {testResult:result, transformedAnswers: answers}

}

module.exports = markTest