const userAnswers = JSON.parse(localStorage.getItem('userAnswers')) || [];
const reportContainer = document.getElementById('report-container');
const summaryContainer = document.getElementById('summary');
const downloadBtn = document.getElementById('download-btn');
let totalCorrect = 0;
let totalIncorrect = 0;

const feedbackMessages = {
    국어: {
        good: '국어 과목을 잘 이해하고 계시네요!',
        average: '국어 과목에서 나쁘지 않은 성적입니다. 좀 더 연습하세요.',
        bad: '국어 과목에서 많은 문제를 틀리셨네요. 문법과 독해 능력을 더 강화하세요.'
    },
    수학: {
        good: '수학 과목을 잘 이해하고 계시네요!',
        average: '수학 과목에서 나쁘지 않은 성적입니다. 좀 더 연습하세요.',
        bad: '수학 과목에서 많은 문제를 틀리셨네요. 기본 계산과 문제 해결 능력을 더 연습하세요.'
    },
    영어: {
        good: '영어 과목을 잘 이해하고 계시네요!',
        average: '영어 과목에서 나쁘지 않은 성적입니다. 좀 더 연습하세요.',
        bad: '영어 과목에서 많은 문제를 틀리셨네요. 단어와 문법을 더 공부하세요.'
    },
    사회: {
        good: '사회 과목을 잘 이해하고 계시네요!',
        average: '사회 과목에서 나쁘지 않은 성적입니다. 좀 더 연습하세요.',
        bad: '사회 과목에서 많은 문제를 틀리셨네요. 역사와 지리 지식을 더 확장하세요.'
    },
    과학: {
        good: '과학 과목을 잘 이해하고 계시네요!',
        average: '과학 과목에서 나쁘지 않은 성적입니다. 좀 더 연습하세요.',
        bad: '과학 과목에서 많은 문제를 틀리셨네요. 기본 개념과 원리를 더 공부하세요.'
    }
};

userAnswers.slice(0, 5).forEach(subject => {
    totalCorrect += subject.correct;
    totalIncorrect += subject.incorrect;

    const subjectDiv = document.createElement('div');
    subjectDiv.classList.add('subject-report');
    subjectDiv.innerHTML = <h2>${subject.subject}</h2>
                            <p>맞춘 문제: ${subject.correct}개</p>
                            <p>틀린 문제: ${subject.incorrect}개</p>;

    subject.answers.forEach((answer, index) => {
        const questionNumber = index + 1; // 질문 번호를 1부터 시작
        const correctAnswer = answer === null ? '답변 없음' : answer;
        subjectDiv.innerHTML += <p>문제 ${questionNumber}: ${correctAnswer}</p>;
    });

    const feedback = document.createElement('p');
    if (subject.incorrect <= 1) {
        feedback.innerText = feedbackMessages[subject.subject].good;
    } else if (subject.incorrect == 2) {
        feedback.innerText = feedbackMessages[subject.subject].average;
    } else {
        feedback.innerText = feedbackMessages[subject.subject].bad;
    }
    subjectDiv.appendChild(feedback);

    reportContainer.appendChild(subjectDiv);
});

const summaryFeedback = document.createElement('p');
summaryFeedback.innerHTML = 전체 맞춘 문제: ${totalCorrect}개<br>전체 틀린 문제: ${totalIncorrect}개;
summaryContainer.appendChild(summaryFeedback);

// 서버로 결과 전송
async function submitResults(subject, correct, incorrect, answers) {
    const result = {
        subject: subject,
        correct: correct,
        incorrect: incorrect,
        answers: answers,
        date: new Date().toISOString()
    };

    try {
        const response = await fetch('/saveResults', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(result)
        });
        if (!response.ok) {
            throw new Error('서버에 결과 전송 실패');
        }
        const data = await response.json();
        console.log('결과가 성공적으로 전송되었습니다:', data);
    } catch (error) {
        console.error('결과 전송 중 오류 발생:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    userAnswers.forEach(answer => {
        submitResults(answer.subject, answer.correct, answer.incorrect, answer.answers);
    });
    localStorage.removeItem('userAnswers'); // 결과 전송 후 데이터 삭제
});

// 결과 다운로드 기능 추가
document.getElementById('download-btn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(userAnswers, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quizResults.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

window.onbeforeunload = () => {
    localStorage.removeItem('userAnswers');
    window.location.href = 'index.html';
};
