document.addEventListener("DOMContentLoaded", function () {
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
        subjectDiv.innerHTML = `<h2>${subject.subject}</h2>
                                <p>맞춘 문제: ${subject.correct}개</p>
                                <p>틀린 문제: ${subject.incorrect}개</p>`;

        subject.answers.forEach((answer, index) => {
            const questionNumber = index + 1; // 질문 번호를 1부터 시작
            const question = answer.question;
            const selectedOption = answer.options[answer.selectedOption];
            const correctOption = answer.options[answer.correctOption];
            subjectDiv.innerHTML += `<p>문제 ${questionNumber}: ${question}</p>
                                     <p>당신의 답: ${selectedOption}</p>
                                     <p>정답: ${correctOption}</p>`;
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
    summaryFeedback.innerHTML = `전체 맞춘 문제: ${totalCorrect}개<br>전체 틀린 문제: ${totalIncorrect}개`;
    summaryContainer.appendChild(summaryFeedback);

    // 엑셀 다운로드 기능 추가
    downloadBtn.addEventListener('click', () => {
        const wb = XLSX.utils.book_new();
        userAnswers.forEach(subject => {
            const wsData = [['문제 번호', '질문', '당신의 답', '정답']];
            subject.answers.forEach((answer, index) => {
                const question = answer.question;
                const selectedOption = answer.options[answer.selectedOption];
                const correctOption = answer.options[answer.correctOption];
                wsData.push([index + 1, question, selectedOption, correctOption]);
            });
            const ws = XLSX.utils.aoa_to_sheet(wsData);
            XLSX.utils.book_append_sheet(wb, ws, subject.subject);
        });
        XLSX.writeFile(wb, 'quizResults.xlsx');
    });

    window.onbeforeunload = () => {
        localStorage.removeItem('userAnswers');
        window.location.href = 'index.html';
    };
});
