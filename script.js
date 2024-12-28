const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const scoreElement = document.getElementById('score');

let currentQuestionIndex = 0;
let score = 0;
let questions = [];

async function fetchQuestions() {
  try {
    const response = await fetch(
      'https://opentdb.com/api.php?amount=10&category=18&type=multiple'
    );
    const data = await response.json();
    questions = data.results.map((q) => formatQuestion(q));
    showQuestion();
  } catch (error) {
    alert('Failed to fetch questions!');
  }
}

function formatQuestion(data) {
  const answers = [...data.incorrect_answers, data.correct_answer];
  return {
    question: data.question,
    answers: shuffleArray(answers),
    correctAnswer: data.correct_answer,
  };
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function showQuestion() {
  resetState();
  const question = questions[currentQuestionIndex];
  questionElement.innerHTML = question.question;
  question.answers.forEach((answer) => {
    const button = document.createElement('button');
    button.innerText = answer;
    button.classList.add('btn');
    button.addEventListener('click', () => selectAnswer(answer));
    answerButtonsElement.appendChild(button);
  });
}

function resetState() {
  nextButton.style.display = 'none';
  answerButtonsElement.innerHTML = '';
}

function selectAnswer(answer) {
  const question = questions[currentQuestionIndex];
  const isCorrect = answer === question.correctAnswer;
  if (isCorrect) {
    score++;
  }
  scoreElement.innerText = `Score: ${score}`;
  Array.from(answerButtonsElement.children).forEach((button) => {
    if (button.innerText === question.correctAnswer) {
      button.classList.add('correct');
    } else {
      button.classList.add('wrong');
    }
    button.disabled = true;
  });
  nextButton.style.display = 'block';
}

function handleNextButton() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    alert(`Quiz completed! Your score: ${score}/${questions.length}`);
    location.reload();
  }
}

nextButton.addEventListener('click', handleNextButton);
fetchQuestions();