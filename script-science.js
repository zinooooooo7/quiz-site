const answers = [0, 2, 2, 2]; // 정답 배열
let userAnswers = JSON.parse(localStorage.getItem('userAnswers')) || [];

document.getElementById('submit-btn').addEventListener('click', () => {
    let correctCount = 0;
    let incorrectCount = 0;
    const form = document.getElementById('quiz-form');
    const currentAnswers = [];

    answers.forEach((answer, index) => {
        const questionName = `question${index + 1}`;
        const selectedOption = form.querySelector(`input[name="${questionName}"]:checked`);
        if (selectedOption) {
            currentAnswers.push(parseInt(selectedOption.value));
            if (parseInt(selectedOption.value) === answer) {
                correctCount++;
            } else {
                incorrectCount++;
            }
        } else {
            currentAnswers.push(null);
            incorrectCount++;
        }
    });

    userAnswers.push({ subject: '과학', correct: correctCount, incorrect: incorrectCount, answers: currentAnswers });
    localStorage.setItem('userAnswers', JSON.stringify(userAnswers));

    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = `제출 완료! 결과 보고서 페이지로 넘어갑니다.`;
    setTimeout(() => {
        window.location.href = 'report.html';
    }, 2000); // 2초 후 이동
});
