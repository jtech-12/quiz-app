const appDiv = document.getElementById('app');
const API_URL = "https://my-json-server.typicode.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME/quizzes";

// Load Handlebars templates
const loadTemplate = async (templateName, context = {}) => {
  const response = await fetch(`templates/${templateName}.hbs`);
  const templateSource = await response.text();
  const template = Handlebars.compile(templateSource);
  appDiv.innerHTML = template(context);
};

// Start the application
const startApp = () => {
  loadTemplate('start');
  document.getElementById('start-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const quizId = document.getElementById('quiz-select').value;
    startQuiz(username, quizId);
  });
};

// Fetch questions and start quiz
const startQuiz = async (username, quizId) => {
  const response = await fetch(`${API_URL}/${quizId}`);
  const quiz = await response.json();
  let currentQuestionIndex = 0;
  let score = 0;

  const renderQuestion = async () => {
    const question = quiz.questions[currentQuestionIndex];
    await loadTemplate('question', { ...question, score });
    document.querySelectorAll('.option-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        if (e.target.textContent === question.answer) {
          score++;
          alert('Correct!');
        } else {
          alert(`Wrong! Correct answer: ${question.answer}`);
        }
        nextQuestion();
      });
    });
  };

  const nextQuestion = () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quiz.questions.length) {
      renderQuestion();
    } else {
      endQuiz();
    }
  };

  renderQuestion();
};

const endQuiz = () => {
  const message = score >= 4 ? "Congratulations, you passed!" : "Sorry, you failed.";
  loadTemplate('end', { message });
  document.getElementById('retry').addEventListener('click', startApp);
};

// Initialize app
startApp();
